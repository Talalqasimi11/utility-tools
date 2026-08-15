export interface ToolDefinition {
  slug: string;
  name: string;
  description: string;
  category: "pdf";
  url: string;
  seoTitle: string;
  seoDescription: string;
  acceptedInputs: string[];
  multiple: boolean;
}
