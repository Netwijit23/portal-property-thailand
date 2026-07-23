import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import ArticleSchema from "@/components/ArticleSchema";
import InlineText from "@/components/InlineText";
import { ArrowRight, Calendar, User } from "lucide-react";
import { BLOG_POSTS, getPostBySlug, getRelatedPosts } from "@/lib/blog";
import { buildMetadata, truncateDescription } from "@/lib/seo";
import { BUSINESS } from "@/lib/business";

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return buildMetadata({
    title: `${post.title} | Portal Property Thailand`,
    description: truncateDescription(post.excerpt),
    path: `/insights/${post.slug}`,
    type: "article",
  });
}

export default async function InsightPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = getRelatedPosts(post);
  const url = `${BUSINESS.url}/insights/${post.slug}`;

  return (
    <>
      <ArticleSchema post={post} url={url} />
      <Navbar />
      <main className="pt-16 min-h-screen bg-[#FAFAF8]">
        <div className="max-w-3xl mx-auto px-6 py-12 md:py-16">
          <Breadcrumbs
            items={[
              { label: "Insights", href: "/insights" },
              { label: post.title, href: `/insights/${post.slug}` },
            ]}
          />

          <div className="mt-6 mb-10">
            <h1 className="font-cormorant text-[36px] md:text-[48px] font-light text-[#0A0A0A] leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center gap-5 mt-4 text-[#8A8680]">
              <span className="flex items-center gap-1.5 font-sans text-[12px]">
                <User size={13} strokeWidth={1.8} /> {post.author}
              </span>
              <span className="flex items-center gap-1.5 font-sans text-[12px]">
                <Calendar size={13} strokeWidth={1.8} /> {formatDate(post.publishDate)}
              </span>
            </div>
          </div>

          <article className="space-y-8">
            {post.sections.map((section, i) => (
              <section key={i}>
                <h2 className="font-cormorant text-[24px] font-medium text-[#0A0A0A] mb-3">{section.heading}</h2>
                {section.paragraphs.map((p, j) => (
                  <p key={j} className="font-sans text-[15px] text-[#3A3A38] leading-relaxed mb-4">
                    <InlineText text={p} />
                  </p>
                ))}
              </section>
            ))}
          </article>

          {related.length > 0 && (
            <div className="mt-16 pt-10 border-t border-[#E8E4DC]">
              <h2 className="font-cormorant text-[24px] font-medium text-[#0A0A0A] mb-5">Related reading</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/insights/${r.slug}`}
                    className="group block bg-white border border-[#E8E4DC] rounded-xl p-5 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-all duration-300"
                  >
                    <h3 className="font-cormorant text-[19px] font-medium text-[#0A0A0A] leading-snug mb-2">{r.title}</h3>
                    <span className="inline-flex items-center gap-1.5 font-sans text-[11px] uppercase tracking-[1.5px] text-[#B8935A]">
                      Read more <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
