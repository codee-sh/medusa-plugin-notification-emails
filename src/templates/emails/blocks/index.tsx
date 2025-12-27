import { SectionBlock } from "./components/section";
import { TextBlock } from "./components/text";
import { RepeaterBlock } from "./components/repeater";
import { HeadingBlock } from "./components/heading";
import { RowBlock } from "./components/row";
import { SeparatorBlock } from "./components/separator";
import { ProductItemBlock } from "./components/product-item";

export function BlockRenderer({ blocks, data }: { blocks: any[]; data?: any }) {
  return blocks.map((block, index) => {
    const blockKey = block.id || `block-${index}`;

    switch (block.type) {
      case "section":
        return (
          <SectionBlock 
            key={blockKey} 
            id={blockKey} 
            props={block.props}
            data={data}
          />
        );
      case "row":
        return (
          <RowBlock 
            key={blockKey} 
            id={blockKey} 
            props={block.props}
            data={data}
          />
        );
      case "product-item":
        console.log("product-item", 'ss');
        return (
          <ProductItemBlock 
            key={blockKey} 
            id={blockKey} 
            props={block.props}
            data={data}
          />
        );
      case "heading":
        return (
          <HeadingBlock 
            key={blockKey} 
            id={blockKey} 
            props={block.props}
            data={data}
          />
        );
      case "text":
        // console.log("product-item", block.props);
        return (
          <TextBlock 
            key={blockKey} 
            id={blockKey} 
            props={block.props}
          />
        );
      case "separator":
        return (
          <SeparatorBlock 
            key={blockKey} 
            id={blockKey} 
            props={block.props}
          />
        );
      case "repeater":
        if (!data) {
          console.warn("RepeaterBlock requires data prop");
          return null;
        }
        return (
          <RepeaterBlock 
            key={blockKey} 
            id={blockKey} 
            props={block.props}
            data={data}
          />
        );
      default:
        return null;
    }
  }) as React.ReactElement[];
}
