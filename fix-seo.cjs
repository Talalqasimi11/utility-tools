const fs = require('fs');
const glob = require('glob');

const files = glob.sync('app/tools/*/page.tsx');

files.forEach(file => {
  const slug = file.split('/')[2];
  let content = fs.readFileSync(file, 'utf8');
  
  const replacement = `export function generateMetadata(): Metadata {
  const tool = getToolBySlug("${slug}");
  if (!tool) return {};
  
  return {
    title: tool.seoTitle,
    description: tool.seoDescription,
    alternates: { canonical: tool.url },
    openGraph: {
      title: tool.seoTitle,
      description: tool.seoDescription,
      url: tool.url,
      type: "website",
    },
  };
}`;
  
  const regex = /export function generateMetadata\(\): Metadata \{[\s\S]*?^\}/m;
  const newContent = content.replace(regex, replacement);
  
  if (newContent !== content) {
    fs.writeFileSync(file, newContent);
    console.log('Fixed ' + file);
  }
});
