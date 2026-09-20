import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { ogImage } from "@/app/lib/og";
import { SITE_URL, SITE_NAME } from "@/app/lib/site";
import { getAllMdxPosts, getMdxPost } from "@/app/lib/posts";
import ArticlePage from "../../components/ArticlePage";
import { mdxComponents, PostFaq } from "../../components/mdx";

/**
 * Renders MDX posts from content/blog/<slug>.mdx.
 *
 * The 28 original posts are static folder routes under app/blog/<slug>/, which
 * Next.js matches before this dynamic segment, so they are unaffected by this
 * route existing. Only slugs returned by generateStaticParams are built.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllMdxPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getMdxPost(slug);
  if (!post) return {};

  const url = `${SITE_URL}/blog/${post.slug}`;
  const image = ogImage(post.title, post.tag);

  return {
    title: `${post.title} · ${SITE_NAME}`,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    // Drafts stay crawlable-but-unindexed until frontmatter flips published.
    ...(post.published ? {} : { robots: { index: false, follow: false } }),
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url,
      publishedTime: post.date,
      images: [{ url: image, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [image],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getMdxPost(slug);
  if (!post) notFound();

  const url = `${SITE_URL}/blog/${post.slug}`;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    url,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };

  // The same frontmatter FAQ feeds both the accordion and this block. Answer
  // engines read it directly, which is the point of putting one on every post.
  const faqLd =
    post.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;

  return (
    <ArticlePage
      crumbs={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: post.crumb }]}
      eyebrow={post.eyebrow}
      title={post.title}
      meta={[post.dateDisplay, post.readingTime]}
      jsonLd={faqLd ? [articleLd, faqLd] : [articleLd]}
      related={post.related}
    >
      {post.intro && <p className="intro">{post.intro}</p>}
      <MDXRemote
        source={post.body}
        components={mdxComponents}
        options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
      />
      <PostFaq items={post.faq} />
    </ArticlePage>
  );
}
