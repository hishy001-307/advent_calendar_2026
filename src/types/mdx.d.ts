declare module '*.mdx' {
  import * as React from 'react';
  const MDXComponent: React.ComponentType<any>;
  export const frontmatter: Record<string, any>;
  export default MDXComponent;
}
