let client = require('contentful').createClient({
    space: process.env.NEXT_CONTENTFUL_SPACE_ID,
    accessToken: process.env.NEXT_CONTENTFUL_ACCES_TOKEN,
})

export async function getStaticPaths() {
    let data = await client.getEntries({
        content_type: 'article',
    });
    console.log('data :', data.items);

    return {
        paths: data.items.map((item) => ({
            params: { slug: item.fields.slug },
        })),
        fallback: false, // false will force nextjs to rebuild the entire project , true nextJs will rebuild only the changing file

    };
}

// props params is define in the return of getStaticPaths
export async function getStaticProps({ params }) {
    let data = await client.getEntries({
        content_type: 'article',
        'fields.slug': params.slug,
    })
    console.log(params.slug);

    return {
        props: {
            article: data.items[0],
        }
    }
}


export default function Article({ article }) {
    console.log(article);
    return <div>{article.fields.title}</div>;
}