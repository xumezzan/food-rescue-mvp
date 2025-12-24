// Simplified mock service to avoid API key dependencies for MVP
export const generateBagHint = async (category, storeName) => {
    // Simulate network delay
    await new Promise(r => setTimeout(r, 800));

    const hints = [
        `Likely contains fresh non bread and savory samsas.`,
        `Expect a mix of sweet pastries and yesterday's bread.`,
        `A delicious assortment of salads and main courses.`,
        `Could feature dairy products and fresh seasonal fruits.`,
        `Tasty leftovers perfectly good for a late dinner.`
    ];
    return hints[Math.floor(Math.random() * hints.length)];
};

export const generateReviews = async (storeName) => {
    await new Promise(r => setTimeout(r, 1000));
    return [
        { user: "Aziz", text: "Great value for money, lots of food!", rating: 5 },
        { user: "Madina", text: "Food was still warm, very happy.", rating: 4.5 },
        { user: "Jamshid", text: "Saved me cooking tonight.", rating: 5 }
    ];
};
