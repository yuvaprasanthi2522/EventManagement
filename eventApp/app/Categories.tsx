// constants/eventCategories.ts
export const EVENT_CATEGORIES = [
    {
        id: "marriage",
        name: "Marriage Event",
        image: "https://i.pinimg.com/564x/42/9b/af/429baf18cbb66c62afa1fcb44918dd6e.jpg"
    },
    {
        id: "birthday",
        name: "Birthday Event",
        image: "https://img.freepik.com/free-photo/happy-birthday-writing-amidst-birthday-decorations_23-2147669173.jpg?semt=ais_hybrid&w=740&q=80"
    },
    {
        id: "collegefest",
        name: "College Fest",
        image: "https://media.assettype.com/freepressjournal/2024-09-13/k0ra7mdx/concert-crowd-music-fanclub-hand-using-cellphone-taking-video-record-live-stream41418-3380.avif?width=1200"
    },
    {
        id: "corporate",
        name: "Corporate Event",
        image: "https://www.jaipurtaxiservices.com/tourpackage/Corporate-Events-in-Jaipur.webp"
    },
    {
        id: "concert",
        name: "Concert/Music Event",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0C5QxoDe3V-9weum6Ltn9aKchfK8jaUyOZg&s"
    },
    {
        id: "conference",
        name: "Conference/Seminar",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVNzwMPcWd6n1ZYa4QgHQRWbqBk0LIwzHQ4A&s"
    },
    {
        id: "party",
        name: "Party Event",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWXobP6XT2YR6c-eOTiSJSl_wpIUTPiN1FqA&s"
    },
    {
        id: "sports",
        name: "Sports Event",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlOfruPsr6pbP6J2EFgXg5SleGc3Cb3398ag&s"
    },
    {
        id: "exhibition",
        name: "Exhibition/Trade Show",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqs_djrMemrIZBydmFp-B2zB00zZx-QiTfqg&s"
    },
    {
        id: "workshop",
        name: "Workshop/Training",
        image: "https://media.istockphoto.com/id/1588288383/photo/back-view-of-student-raising-his-hand-to-answer-teachers-question-during-education-training.jpg?s=612x612&w=0&k=20&c=ZSyPrLqe6WdE81WXiESD5AqIVw1a7hKv85UI5I-Vwco="
    }
];

// Helper function to get category image
export const getCategoryImage = (categoryId: string): string => {
    const category = EVENT_CATEGORIES.find(
        cat => cat.id === categoryId || cat.name === categoryId
    );
    return category?.image || EVENT_CATEGORIES[0].image;
};

// Helper function to get category name
export const getCategoryName = (categoryId: string): string => {
    const category = EVENT_CATEGORIES.find(
        cat => cat.id === categoryId || cat.name === categoryId
    );
    return category?.name || categoryId;
};