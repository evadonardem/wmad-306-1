import StudentLayout from '@/Layouts/StudentLayout';
import ArticleCard from './Components/ArticleCard';

export default function BrowseArticles({ articles = [] }) {
    return (
        <StudentLayout>
            <h2>Browse Articles</h2>
            {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
            ))}
        </StudentLayout>
    );
}

