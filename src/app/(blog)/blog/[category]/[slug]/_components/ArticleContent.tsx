import styles from '../../[slug]/css/page.module.css';

export default function ArticleContent({ html }: { html: string }) {
  return (
    <div className={styles.content} dangerouslySetInnerHTML={{ __html: html }} />
  );
}