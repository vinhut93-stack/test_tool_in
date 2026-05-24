const GOOGLE_SHEET_API_URL =
"https://script.google.com/macros/s/AKfycbxUYHfZAoZLQ4vdG_FdVgE70aGttF6peS32wgH2VdigCPVRtAs9FAhyq4uN9KIEnUNLug/exec";

export async function fetchLessons(){

    const response =
    await fetch(GOOGLE_SHEET_API_URL);

    const data =
    await response.json();

    return data.map(item => ({

        id:
        item.Id ||
        item.id ||
        crypto.randomUUID(),

        age_group:
        item.Age_Group ||
        item.age_group ||
        "General",

        level:Number(
            item.Level ||
            item.level ||
            1
        ),

        word:
        item.Word ||
        item.word ||
        "",

        meaning:
        item.Meaning ||
        item.meaning ||
        "",

        img:
        item.Img ||
        item.img ||
        "",

        type:
        item.Type ||
        item.type ||
        "keyboard",

        xp:Number(
            item.XP ||
            item.xp ||
            10
        ),

        difficulty:
        item.Difficulty ||
        item.difficulty ||
        "easy"
    }));
}