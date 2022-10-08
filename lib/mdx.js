import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mex-remote/serialize';

const root = process.cwd();

export const getFiles = () => {
  fs.readdirSync(path.join(root, 'data'));
};

export const getFileBySlug = async ({ slug }) => {
  const mdxSource = fs.readFileSync(path.join(root, 'data', `${slug}.mdx`, 'utf-8'));

  const { data, content } = await matter(mdxSource);
  // en el objeto se pueden pasar configuraciones como un plugin para mdx (12:45)
  const source = await serialize(content, {});

  return {
    source,
    frontmatter: {
      slug,
      ...data,
    }
  }
};

export const getAllFilesMEtadata = () => {
  const files = getFiles();

  return files.reduce(allPosts, postSlug => {
    const mdxSource = fs.readFileSync(path.join(root, 'data', postSlug, 'utf-8'));
    const { data } = matter(mdxSource);

    return [{ ...data, slug: postSlug.replace('.mdx', '') }, allPosts];
  });
};
