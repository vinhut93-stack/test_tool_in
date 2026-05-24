export function speakWord(
    text
){

    if(
        !(
            "speechSynthesis"
            in window
        )
    ){
        return;
    }

    speechSynthesis.cancel();

    const utterance =
    new SpeechSynthesisUtterance(
        text
    );

    utterance.lang =
    "en-US";

    utterance.rate =
    0.85;

    speechSynthesis.speak(
        utterance
    );
}