# Analiza plugin medusa-plugin-notifications-emails

## 1. Analiza nazewnictwa metod w services

### 1.1 MpnBuilderService (`modules/mpn-builder/service.ts`)

#### Metody publiczne:
- ✅ `listTemplateServices(type?: string)` - **Dobre nazewnictwo** (zmienione z `getAvailableTemplates`)
  - Czytelne, opisowe - jasno wskazuje że zwraca listę serwisów szablonów
  - Opcjonalny parametr `type` dobrze obsłużony
  
- ✅ `getTemplateService(templateServiceId: string)` - **Dobre nazewnictwo**
  - Spójne z konwencją getterów
  - Zwraca `{ templateService, enabled } | undefined`

#### Metody prywatne:
- ✅ `initializeTemplateServices()` - **Dobre nazewnictwo**
  - Wyraźnie wskazuje na inicjalizację
  
- ⚠️ `getTemplateServices()` - **Można poprawić**
  - Prywatna metoda getter - można rozważyć usunięcie i bezpośredni dostęp do `this.templateServices_`
  - Używana tylko raz w `getTemplateService()`

#### Metody z MedusaService (dziedziczone):
- `createMpnBuilderTemplates()` - używana w `create-template.ts`
- `updateMpnBuilderTemplates()` - używana w `edit-template.ts`
- `deleteMpnBuilderTemplates()` - używana w `delete-template.ts`

**Rekomendacja:** Nazewnictwo jest spójne i czytelne. Metoda `getTemplateServices()` może być usunięta na rzecz bezpośredniego dostępu.

---

### 1.2 BaseTemplateService (`modules/mpn-builder/services-local/base-template-service.ts`)

#### Metody publiczne:
- ✅ `registerTemplate(name: string, renderer: TemplateRenderer)` - **Dobre nazewnictwo**
- ✅ `getTemplate(name: string)` - **Dobre nazewnictwo**
- ✅ `getSystemTemplates()` - **Dobre nazewnictwo**

#### Metody protected:
- ✅ `prepareData(params)` - **Dobre nazewnictwo**
  - Wyraźnie wskazuje na przygotowanie danych

#### Metody abstrakcyjne:
- ⚠️ `interpolateFunction` - **Można poprawić**
  - To właściwość, nie metoda
  - Nazwa sugeruje funkcję, ale jest właściwością typu `(blocks, data, translator, config?) => any[]`
  - **Rekomendacja:** Rozważyć zmianę na `interpolateBlocks` jako metodę abstrakcyjną lub `interpolateBlocksFunction`

**Rekomendacja:** Ogólnie dobre nazewnictwo, ale `interpolateFunction` jako właściwość może być mylące.

---

### 1.3 EmailTemplateService (`modules/mpn-builder/services-local/email-template-service.ts`)

#### Metody publiczne:
- ✅ `render(params)` - **Dobre nazewnictwo**
- ✅ `renderSync(params)` - **Dobre nazewnictwo**
- ✅ `transformBlocksForRendering(blocks)` - **Dobre nazewnictwo**
  - Bardzo opisowa nazwa, dobrze dokumentowana

#### Metody prywatne:
- ✅ `interpolateBlocks(blocks, data, translator, config?)` - **Dobre nazewnictwo**
- ✅ `initializeSystemTemplates()` - **Dobre nazewnictwo**

**Rekomendacja:** Wszystkie metody mają czytelne i spójne nazwy.

---

### 1.4 SlackTemplateService (`modules/mpn-builder/services-local/slack-template-service.ts`)

#### Metody publiczne:
- ✅ `render(params)` - **Dobre nazewnictwo** (spójne z EmailTemplateService)
- ✅ `transformBlocksForRendering(blocks)` - **Dobre nazewnictwo** (spójne z EmailTemplateService)

#### Metody prywatne:
- ✅ `interpolateSlackBlocks(blocks, data, translator, config?)` - **Dobre nazewnictwo**
  - Wyraźnie wskazuje na specyfikę Slack
- ✅ `recursivelyInterpolateText(node, data, translator, config?)` - **Dobre nazewnictwo**
- ✅ `initializeSystemTemplates()` - **Dobre nazewnictwo**

**Rekomendacja:** Wszystkie metody mają czytelne nazwy, spójne z EmailTemplateService.

---

## 2. Analiza workflows - użycia i optymalizacje

### 2.1 Workflows związane z szablonami (mpn-builder)

#### `getTemplatesWorkflow` 
- **Status:** ⚠️ **NIEUŻYWANY**
- **Lokalizacja:** `workflows/mpn-builder/get-templates.ts`
- **Opis:** Zwraca wszystkie szablony (system + db) pogrupowane po kanałach
- **Użycia:** Brak użyć w kodzie
- **Rekomendacja:** 
  - **USUNĄĆ** jeśli nie jest używany
  - LUB połączyć z `getTemplatesDbWorkflow` i `getTemplatesSystemWorkflow` w jeden workflow z parametrem `type: "all" | "db" | "system"`

#### `getTemplatesDbWorkflow`
- **Status:** ✅ **UŻYWANY**
- **Lokalizacja:** `workflows/mpn-builder/get-templates-db.ts`
- **Użycia:**
  - `api/admin/mpn/templates/route.ts` (GET) - linia 87
- **Opis:** Zwraca tylko szablony z bazy danych, pogrupowane po kanałach
- **Rekomendacja:** 
  - Workflow jest prosty i dobrze użyty
  - Można rozważyć dodanie parametru `type` do filtrowania po kanale (obecnie zwraca wszystkie)

#### `getTemplatesSystemWorkflow`
- **Status:** ✅ **UŻYWANY**
- **Lokalizacja:** `workflows/mpn-builder/get-templates-system.ts`
- **Użycia:**
  - `api/admin/mpn/templates/system/route.ts` (GET) - linia 13
- **Opis:** Zwraca tylko szablony systemowe, pogrupowane po kanałach
- **Rekomendacja:** 
  - Workflow jest prosty i dobrze użyty
  - Można rozważyć dodanie parametru `type` do filtrowania po kanale

#### `getTemplateByIdWorkflow`
- **Status:** ✅ **UŻYWANY**
- **Lokalizacja:** `workflows/mpn-builder/get-template-by-id.ts`
- **Użycia:**
  - `workflows/mpn-builder-services/steps/email-service.ts` - linia 40 (wewnętrzne użycie)
- **Opis:** Zwraca pojedynczy szablon po ID
- **Rekomendacja:** 
  - Workflow jest dobrze zaprojektowany
  - Używany tylko wewnętrznie - można rozważyć czy powinien być publiczny

#### `getBlocksByTemplateWorkflow`
- **Status:** ✅ **UŻYWANY**
- **Lokalizacja:** `workflows/mpn-builder/get-blocks-by-template-id.ts`
- **Użycia:**
  - `workflows/mpn-builder-services/steps/email-service.ts` - linia 34 (wewnętrzne użycie)
  - `api/admin/mpn/templates/[id]/blocks/route.ts` - linia 97 (GET) - **ALE NIE BEZPOŚREDNIO**, używa query.graph zamiast workflow
- **Opis:** Zwraca bloki szablonu w formie drzewa
- **Rekomendacja:** 
  - ⚠️ **PROBLEM:** API route `/api/admin/mpn/templates/[id]/blocks` (GET) nie używa workflow, tylko bezpośrednio `query.graph`
  - **Rekomendacja:** Ujednolicić - użyć workflow również w API route dla spójności

#### `createTemplateWorkflow`
- **Status:** ✅ **UŻYWANY**
- **Lokalizacja:** `workflows/mpn-builder/create-template.ts`
- **Użycia:**
  - `api/admin/mpn/templates/route.ts` (POST) - linia 58
- **Opis:** Tworzy nowy szablon
- **Rekomendacja:** 
  - Workflow jest dobrze zaprojektowany
  - Brak walidacji w workflow - walidacja jest w API route (zod schema)

#### `editTemplateWorkflow`
- **Status:** ✅ **UŻYWANY**
- **Lokalizacja:** `workflows/mpn-builder/edit-template.ts`
- **Użycia:**
  - `api/admin/mpn/templates/route.ts` (POST) - linia 49 (gdy `req.body.id` istnieje)
- **Opis:** Aktualizuje istniejący szablon
- **Rekomendacja:** 
  - Workflow jest dobrze zaprojektowany
  - ⚠️ **PROBLEM:** Workflow przyjmuje `items: Template[]` ale nie przyjmuje `id` - ID jest w `items[0].id`
  - **Rekomendacja:** Rozważyć zmianę na `{ id: string, items: Template[] }` dla większej czytelności

#### `editTemplateBlocksWorkflow`
- **Status:** ✅ **UŻYWANY**
- **Lokalizacja:** `workflows/mpn-builder/edit-template-blocks.ts`
- **Użycia:**
  - `api/admin/mpn/templates/[id]/blocks/route.ts` (POST) - linia 35
- **Opis:** Aktualizuje bloki szablonu
- **Rekomendacja:** 
  - Workflow jest dobrze zaprojektowany
  - ⚠️ **NIESPÓJNOŚĆ:** Workflow przyjmuje `templateId` (camelCase), ale step przyjmuje `template_id` (snake_case)
  - **Rekomendacja:** Ujednolicić nazewnictwo parametrów

#### `deleteTemplateWorkflow`
- **Status:** ✅ **UŻYWANY**
- **Lokalizacja:** `workflows/mpn-builder/delete-template.ts`
- **Użycia:**
  - `api/admin/mpn/templates/route.ts` (DELETE) - linia 112
- **Opis:** Usuwa szablon
- **Rekomendacja:** 
  - Workflow jest dobrze zaprojektowany

---

### 2.2 Workflows związane z renderowaniem (mpn-builder-services)

#### `emailServiceWorkflow`
- **Status:** ✅ **UŻYWANY**
- **Lokalizacja:** `workflows/mpn-builder-services/email-service.ts`
- **Użycia:**
  - `api/admin/mpn/render-template/route.ts` (POST) - linia 46
  - `subscribers/order-placed.ts` - linia 69
  - `subscribers/order-completed.ts` - linia 56
- **Opis:** Renderuje email z szablonu (systemowego lub z bazy)
- **Rekomendacja:** 
  - ⚠️ **PROBLEM:** Workflow wywołuje inne workflows wewnątrz step (`getBlocksByTemplateWorkflow`, `getTemplateByIdWorkflow`)
  - **Rekomendacja:** Rozważyć użycie `parallelize()` dla równoległego pobierania bloków i danych szablonu (jeśli to możliwe)
  - **Rekomendacja:** Dodać cache dla często używanych szablonów systemowych

---

### 2.3 Workflows pomocnicze (order, store, region)

#### `getOrderByIdWorkflow`
- **Status:** ✅ **UŻYWANY**
- **Lokalizacja:** `workflows/order/get-order-by-id.ts`
- **Użycia:**
  - `subscribers/order-placed.ts` - linia 41
  - `subscribers/order-completed.ts` - linia 39
- **Opis:** Pobiera zamówienie z relacjami
- **Rekomendacja:** 
  - Workflow jest dobrze zaprojektowany
  - ⚠️ **PROBLEM:** Komentarze w workflow są nieprawidłowe (mówią o "order by ID with related items, customer, addresses" ale workflow nazywa się `get-order-by-id`)
  - **Rekomendacja:** Zaktualizować komentarze

#### `getStoreWorkflow`
- **Status:** ⚠️ **ZAKOMENTOWANY W KODZIE**
- **Lokalizacja:** `workflows/store/get-store-by-id.ts`
- **Użycia:**
  - `subscribers/order-placed.ts` - linia 59 (zakomentowane)
- **Opis:** Pobiera dane sklepu
- **Rekomendacja:** 
  - Workflow istnieje ale nie jest używany
  - Jeśli nie będzie potrzebny - usunąć
  - Jeśli będzie potrzebny - odkomentować i użyć

#### `getRegionWorkflow`
- **Status:** ⚠️ **ZAKOMENTOWANY W KODZIE**
- **Lokalizacja:** `workflows/region/get-region-by-id.ts`
- **Użycia:**
  - `subscribers/order-placed.ts` - linia 60 (zakomentowane)
- **Opis:** Pobiera dane regionu
- **Rekomendacja:** 
  - Workflow istnieje ale nie jest używany
  - Jeśli nie będzie potrzebny - usunąć
  - Jeśli będzie potrzebny - odkomentować i użyć

---

## 3. Rekomendacje optymalizacyjne

### 3.1 Konsolidacja workflows szablonów

**Problem:** Mamy 3 workflows do pobierania szablonów:
- `getTemplatesWorkflow` (nieużywany)
- `getTemplatesDbWorkflow` (używany)
- `getTemplatesSystemWorkflow` (używany)

**Rekomendacja:**
```typescript
// Zamiast 3 workflows, jeden z parametrem:
getTemplatesWorkflow(container).run({
  input: {
    type: "all" | "db" | "system", // opcjonalny, domyślnie "all"
    channel?: string // opcjonalny filtr po kanale
  }
})
```

**Korzyści:**
- Mniej kodu do utrzymania
- Spójne API
- Łatwiejsze rozszerzanie

---

### 2.2 Ujednolicenie użycia workflows w API routes

**Problem:** 
- `api/admin/mpn/templates/[id]/blocks/route.ts` (GET) nie używa workflow `getBlocksByTemplateWorkflow`, tylko bezpośrednio `query.graph`

**Rekomendacja:**
- Użyć workflow również w API route dla spójności
- Workflow już istnieje i jest dobrze zaprojektowany

---

### 3.3 Optymalizacja `emailServiceWorkflow`

**Problem:**
- Workflow wywołuje 2 inne workflows sekwencyjnie w step:
  - `getBlocksByTemplateWorkflow`
  - `getTemplateByIdWorkflow`

**Rekomendacja:**
```typescript
// W emailServiceStep użyć parallelize():
const [blocksResult, templateResult] = await parallelize(
  getBlocksByTemplateWorkflow(container).run({ input: { template_id } }),
  getTemplateByIdWorkflow(container).run({ input: { template_id } })
)
```

**Korzyści:**
- Szybsze wykonanie (równoległe zapytania)
- Lepsza wydajność

---

### 3.4 Cache dla szablonów systemowych

**Problem:**
- Szablony systemowe są pobierane za każdym razem z serwisu
- Nie zmieniają się w runtime

**Rekomendacja:**
- Dodać cache w `BaseTemplateService.getSystemTemplates()`
- Cache może być w pamięci (Map) lub w Redis dla większych aplikacji

---

### 3.5 Ujednolicenie nazewnictwa parametrów

**Problem:**
- Niektóre workflows używają `template_id` (snake_case)
- Inne używają `templateId` (camelCase)

**Rekomendacja:**
- Ujednolicić na `templateId` (camelCase) zgodnie z konwencją TypeScript/JavaScript
- Zaktualizować wszystkie workflows i steps

---

### 3.6 Usunięcie nieużywanych workflows

**Workflows do usunięcia:**
- `getTemplatesWorkflow` - nieużywany
- `getStoreWorkflow` - zakomentowany, nieużywany (lub odkomentować jeśli potrzebny)
- `getRegionWorkflow` - zakomentowany, nieużywany (lub odkomentować jeśli potrzebny)

---

### 3.7 Dodanie walidacji do workflows

**Problem:**
- Niektóre workflows nie mają walidacji (walidacja jest tylko w API routes)

**Rekomendacja:**
- Dodać walidację w steps workflows dla bezpieczeństwa
- Użyć `MedusaError` dla błędów walidacji

---

## 4. Podsumowanie

### Pozytywne aspekty:
1. ✅ Spójne nazewnictwo metod w services
2. ✅ Dobrze zaprojektowane workflows dla CRUD operacji
3. ✅ Separacja odpowiedzialności (services vs workflows)
4. ✅ Dobra dokumentacja w kodzie

### Obszary do poprawy:
1. ⚠️ Nieużywany workflow `getTemplatesWorkflow`
2. ⚠️ Niespójne użycie workflows w API routes
3. ⚠️ Brak równoległości w `emailServiceWorkflow`
4. ⚠️ Niespójne nazewnictwo parametrów (snake_case vs camelCase)
5. ⚠️ Zakomentowane workflows (`getStoreWorkflow`, `getRegionWorkflow`)
6. ⚠️ Brak cache dla szablonów systemowych

### Priorytety optymalizacji:
1. **Wysoki:** Usunąć nieużywany `getTemplatesWorkflow` lub zintegrować z innymi
2. **Wysoki:** Ujednolicić użycie workflows w API routes
3. **Średni:** Dodać równoległość w `emailServiceWorkflow`
4. **Średni:** Ujednolicić nazewnictwo parametrów
5. **Niski:** Dodać cache dla szablonów systemowych
6. **Niski:** Rozważyć usunięcie lub użycie zakomentowanych workflows
