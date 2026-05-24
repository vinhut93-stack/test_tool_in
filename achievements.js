export function checkAchievements(
    progress
){

    const unlocked=[];

    if(progress.xp >= 100){
        unlocked.push(
            "🏅 100 XP Hero"
        );
    }

    if(progress.score >= 20){
        unlocked.push(
            "🌟 Smart Kid"
        );
    }

    return unlocked;
}