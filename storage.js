const STORAGE_KEY =
"english_kids_v3";

export function loadProgress(){

    const data =
    localStorage.getItem(
        STORAGE_KEY
    );

    if(data){
        return JSON.parse(data);
    }

    return {

        xp:0,
        hearts:5,
        streak:0,
        level:1,
        score:0,
        age_group:"",
        completedLessons:[],
        wrongWords:[]
    };
}

export function saveProgress(
    progress
){
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(progress)
    );
}