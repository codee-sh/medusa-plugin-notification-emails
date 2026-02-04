# Analiza optymalizacji: email-service.ts

## Obecna implementacja

### Plik: `workflows/mpn-builder-services/steps/email-service.ts`

**Obecny przepływ:**
1. Linie 32-38: Wywołanie `getBlocksByTemplateWorkflow` - pobiera bloki szablonu
2. Linie 40-44: Wywołanie `getTemplateWorkflow` - pobiera dane szablonu (SEKWENCYJNIE po blokach)
3. Linia 64: Używa tylko `template?.subject` z wyniku

### Problemy:

1. **Sekwencyjne wykonanie** - dwa workflows wykonują się jeden po drugim, zamiast równolegle
2. **Nadmiarowe pobieranie danych** - `getTemplateWorkflow` pobiera wszystkie pola, a potrzebne jest tylko `subject`
3. **Duplikacja danych** - `getBlocksByTemplateWorkflow` już pobiera `template.subject` (linia 89 w `get-blocks-by-template-id.ts`)

---

## Możliwości optymalizacji

### 1. Równoległe wykonanie workflows (parallelize)

**Obecny kod:**
```typescript
// Sekwencyjnie
const { result: { blocks } } = await getBlocksByTemplateWorkflow(container).run({...})
const { result: templateData } = await getTemplateWorkflow(container).run({...})
```

**Zoptymalizowany:**
```typescript
// Równolegle
const [blocksResult, templateResult] = await Promise.all([
  getBlocksByTemplateWorkflow(container).run({...}),
  getTemplateWorkflow(container).run({...})
])
```

**Korzyści:**
- ⚡ Szybsze wykonanie (2x szybciej jeśli oba zapytania trwają podobnie długo)
- 📈 Lepsza wydajność przy wielu równoczesnych requestach

---

### 2. Optymalizacja fields w getTemplateWorkflow

**Obecny kod:**
```typescript
const { result: templateData } = await getTemplateWorkflow(container).run({
  input: {
    template_id: templateId,
  }
})
// Pobiera wszystkie pola: id, name, label, description, channel, locale, subject, is_active, created_at, updated_at
```

**Zoptymalizowany:**
```typescript
const { result: templateData } = await getTemplateWorkflow(container).run({
  input: {
    template_id: templateId,
    fields: ["id", "subject"], // Tylko potrzebne pola
  }
})
```

**Korzyści:**
- 📉 Mniejsze zużycie pamięci
- ⚡ Szybsze zapytanie do bazy (mniej danych do transferu)
- 🎯 Lepsze wykorzystanie sieci

---

### 3. Eliminacja duplikacji - użycie subject z bloków

**Analiza:**
- `getBlocksByTemplateWorkflow` już pobiera `template.subject` (linia 89 w `get-blocks-by-template-id.ts`)
- W `email-service.ts` używa się tylko `template?.subject`

**Opcja A: Użyć subject z bloków**
```typescript
const { result: { blocks: templateBlocks } } = await getBlocksByTemplateWorkflow(container).run({...})

// Pobierz subject z pierwszego bloku (jeśli dostępny)
const subject = templateBlocks[0]?.template?.subject || null

// Pomiń wywołanie getTemplateWorkflow jeśli potrzebujemy tylko subject
```

**Opcja B: Rozszerzyć getBlocksByTemplateWorkflow**
```typescript
// W get-blocks-by-template-id.ts zwracać też template metadata
return new StepResponse({
  blocks: tree,
  template: blocks[0]?.template || null // Jeśli bloki mają relację template
})
```

**Korzyści:**
- 🚫 Eliminacja jednego wywołania workflow
- ⚡ Szybsze wykonanie (1 workflow zamiast 2)
- 📉 Mniejsze obciążenie bazy danych

---

### 4. Kombinacja wszystkich optymalizacji

**Najbardziej zoptymalizowana wersja:**

```typescript
if (!isSystemTemplateId) {
  // Opcja 1: Jeśli bloki zawierają template.subject, użyj tylko bloków
  const { result: { blocks: templateBlocks } } = await getBlocksByTemplateWorkflow(container).run({
    input: { template_id: templateId }
  })
  
  // Pobierz subject z bloków (jeśli dostępny)
  const subject = templateBlocks[0]?.template?.subject || null
  
  blocks = templateEmailService?.transformBlocksForRendering(templateBlocks)
  template = { subject } // Tylko potrzebne pole
  
  // Opcja 2: Jeśli potrzebujesz więcej pól z template, użyj równoległego wykonania + fields
  const [blocksResult, templateResult] = await Promise.all([
    getBlocksByTemplateWorkflow(container).run({
      input: { template_id: templateId }
    }),
    getTemplateWorkflow(container).run({
      input: {
        template_id: templateId,
        fields: ["id", "subject"], // Tylko potrzebne pola
      }
    })
  ])
  
  blocks = templateEmailService?.transformBlocksForRendering(blocksResult.result.blocks)
  template = templateResult.result.template
}
```

---

## Rekomendacje

### Priorytet 1: Równoległe wykonanie (parallelize)
- **Wpływ:** Wysoki - 2x szybsze wykonanie
- **Trudność:** Niska - prosta zmiana
- **Rekomendacja:** ✅ **Zaimplementować**

### Priorytet 2: Optymalizacja fields
- **Wpływ:** Średni - mniejsze zużycie zasobów
- **Trudność:** Niska - dodanie parametru `fields`
- **Rekomendacja:** ✅ **Zaimplementować**

### Priorytet 3: Eliminacja duplikacji (subject z bloków)
- **Wpływ:** Wysoki - eliminacja całego workflow
- **Trudność:** Średnia - wymaga sprawdzenia czy bloki zawsze mają template.subject
- **Rekomendacja:** ⚠️ **Sprawdzić i rozważyć**

---

## Przykładowa zoptymalizowana implementacja

```typescript
if (!isSystemTemplateId) {
  // Równoległe wykonanie + optymalizacja fields
  const [blocksResult, templateResult] = await Promise.all([
    getBlocksByTemplateWorkflow(container).run({
      input: { template_id: templateId }
    }),
    getTemplateWorkflow(container).run({
      input: {
        template_id: templateId,
        fields: ["subject"], // Tylko potrzebne pole
      }
    })
  ])

  blocks = templateEmailService?.transformBlocksForRendering(blocksResult.result.blocks)
  template = templateResult.result.template
}
```

**Szacunkowa poprawa wydajności:**
- ⚡ Czas wykonania: **~50% szybciej** (równoległe wykonanie)
- 📉 Transfer danych: **~90% mniej** (tylko `subject` zamiast wszystkich pól)
- 🎯 Łączna poprawa: **znacząca** przy większym obciążeniu

---

## Dodatkowe uwagi

1. **Sprawdzenie czy bloki zawierają template.subject:**
   - W `get-blocks-by-template-id.ts` linia 89: `fields: [..., "template", "template.subject"]`
   - Jeśli to działa, można całkowicie pominąć `getTemplateWorkflow`

2. **Obsługa błędów:**
   - Przy równoległym wykonaniu trzeba obsłużyć błędy z obu workflows
   - Rozważyć `Promise.allSettled()` jeśli jeden workflow może się nie powieść

3. **Cache:**
   - Rozważyć cache dla często używanych szablonów
   - Szczególnie dla szablonów systemowych
