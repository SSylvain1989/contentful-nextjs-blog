import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, MARKS } from '@contentful/rich-text-types';
import Image from 'next/image'

let client = require('contentful').createClient({
    space: process.env.NEXT_CONTENTFUL_SPACE_ID,
    accessToken: process.env.NEXT_CONTENTFUL_ACCES_TOKEN,
})

export async function getStaticPaths() {
    let data = await client.getEntries({
        content_type: 'article',
    });

    return {
        paths: data.items.map((item) => ({
            params: { slug: item.fields.slug },
        })),
        fallback: true, // false will force nextjs to rebuild the entire project , true nextJs will rebuild only the changing file

    };
}

// props params is define in the return of getStaticPaths
export async function getStaticProps({ params }) {
    let data = await client.getEntries({
        content_type: 'article',
        'fields.slug': params.slug,
    })

    return {
        props: {
            article: data.items[0],
        },
        revalidate: 1,
    }
}


export default function Article({ article }) {
    if (!article) return <div>404</div>;

    return (
        <div>
            <h1>{article.fields.title}</h1>
            <div>{documentToReactComponents(article.fields.content, {
                renderNode: {
                    [BLOCKS.EMBEDDED_ASSET]: node =>
                        <Image
                            src={'https:' + node.data.target.fields.file.url}
                            width={600}
                            height={400}
                        />
                }
            })}</div>
        </div>
    );
}