let winAmount = 0;

document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.querySelector("#button");
    const spinButton = document.querySelector("#spin");
    const spinWheel = document.querySelector("#spin-wheel");
    const skip = document.querySelector("#skip");
    const popup = document.querySelector("#popup");
    const backDrop = document.querySelector("#back-drop");
    const langSelect = document.querySelector(".lang-select");
    const optionsContainer = document.querySelector(".options-container");
    const geLang = document.querySelectorAll(".lang_ge");
    const enLang = document.querySelectorAll(".lang_en");
    const optionsList = document.querySelectorAll(".option");
    const progressCircle = document.querySelector(".autoplay-progress svg");
    const progressContent = document.querySelector(".autoplay-progress span");
    let language = 'ge';
    let timeOuts = [];
    let countDownIntervals = [];
    let progressIntervals = [];

    const wheelValues = [20, 70, 5, 15, 25, 50];
    let deg = 0;

    const swiper = new Swiper('.swiper', {
        on: {
            slideChangeTransitionEnd: function () {
                if (swiper.activeIndex === 0) {
                    progressContent.style.display = 'none';
                    progressCircle.style.display = 'none'
                    if (timeOuts.length > 0) {
                        timeOuts.forEach((timeOut) => {
                            clearTimeout(timeOut);
                        })
                        timeOuts = [];
                        if (progressIntervals.length > 0) {
                            progressIntervals.forEach((interval) => {
                                clearInterval(interval);
                            })
                            progressIntervals = [];
                        }
                        if (countDownIntervals.length > 0) {
                            countDownIntervals.forEach((interval) => {
                                clearInterval(interval);
                            })
                            countDownIntervals = [];
                        }
                    }
                }
                if (swiper.activeIndex === 1) {
                    changeLanguage(language);
                    progressContent.style.display = 'block';
                    progressCircle.style.display = 'block'
                }
                if (swiper.activeIndex === 2) {
                    progressContent.style.display = 'none';
                    progressCircle.style.display = 'none'
                    swiper.allowSlidePrev = false;
                    swiper.allowSlideNext = false;
                }
                if (swiper.activeIndex === 3) {
                    swiper.allowSlidePrev = true;
                    swiper.allowSlideNext = false;
                }
            }
        }
    });

    const handleSpinStart = () => {
        spinButton.style.pointerEvents = "none";
        startButton.style.pointerEvents = "none";
        deg = Math.floor(1000 + Math.random() * 5000);
        const excess = deg - (parseInt(deg / 360) * 360);
        const segment = parseInt(excess / 60);
        winAmount = wheelValues[segment];
        spinButton.style.transition = "all 3s ease-out";
        spinButton.style.transform = `rotate(${deg}deg)`;
        spinButton.classList.add("blur");
    };

    const handleSpinEnd = () => {
        const amount = document.getElementById("amount");
        spinButton.classList.remove("blur");
        startButton.style.pointerEvents = "auto";
        spinButton.style.transition = "none";
        const actualDeg = deg % 360;
        spinButton.style.transform = `rotate(${actualDeg}deg)`;
        setTimeout(() => {
            amount.innerHTML = winAmount;
            popup.style.display = "flex";
            backDrop.style.display = "block";
        }, 1000);
    };


    const changeLanguage = (lang) => {
        language = lang;
        langSelect.classList.remove("open");
        swiper.slideTo(1);
        const delayInMilliseconds = 5000;
        if (timeOuts.length === 0) {
            let timeoutID = setTimeout(() => {
                timeOuts = [];
            }, delayInMilliseconds);
            timeOuts.push(timeoutID);
            let timeLeft = delayInMilliseconds;
            let progress = 1;
            progressContent.textContent = `${Math.ceil(timeLeft / 1000)}`;
            const countDownInterval = setInterval(() => {
                timeLeft -= 1000;
                progressContent.textContent = `${Math.ceil(timeLeft / 1000)}`;
                if (timeLeft <= 0) {
                    clearTimeout(timeoutID);
                    clearInterval(countDownInterval);
                    swiper.activeIndex === 1 && swiper.slideTo(2);
                    progressContent.textContent = ``;
                }
            }, 1000);
            countDownIntervals.push(countDownInterval);
            const progressInterval = setInterval(() => {
                progress -= 0.0008;
                progressCircle.style.setProperty("--progress", progress);
                if (progress <= 0) {
                    clearTimeout(timeoutID);
                    clearInterval(progressInterval);
                }
            }, 1);
            progressIntervals.push(progressInterval);
        }
        putLang(lang);
    };

    const putLang = (language) => {
        document.querySelectorAll('lang').forEach((lang) => {
            language === 'en' ? lang.innerHTML = en[lang.id] : lang.innerHTML = ge[lang.id]
        })
    }

    startButton.addEventListener("click", handleSpinStart);
    spinButton.addEventListener("click", handleSpinStart);
    spinWheel.addEventListener("click", handleSpinStart);
    spinButton.addEventListener("transitionend", handleSpinEnd);
    skip.addEventListener("click", () => {
        document.getElementById('gift_is_sent').innerHTML = `<br/><br/><br/><br/><br/><br/><br/>`;
        swiper.allowSlideNext = true;
        swiper.slideNext();
    });
    geLang.forEach((gLang) => {
        gLang.addEventListener("click", () => changeLanguage("ge"));
    })
    enLang.forEach((eLang) => {
        eLang.addEventListener("click", () => changeLanguage("en"));
    })
    langSelect.addEventListener("click", () => {
        optionsContainer.classList.toggle("active");
        langSelect.classList.toggle("open");
    });
    optionsList.forEach((o) => {
        o.addEventListener("click", () => {
            langSelect.innerHTML = o.querySelector("label").innerHTML;
            optionsContainer.classList.remove("active");
        });
    });
});


function moveToNextInput(input) {
    let nextInput = null;
    let nextSibling = input.parentElement.nextElementSibling;
    if (nextSibling) {
        nextInput = nextSibling.querySelector('input');
    }

    if (input.value.length === 1) {
        if (nextInput) {
            nextInput.focus();
        } else {
            input.blur(); // remove focus from the input field
        }
    } else if (input.value.length > 1) {
        input.value = input.value.slice(-1); // keep only the last character
    }

    // Replace the value if the input already has a value
    if (input.value && input.value.length === 1) {
        input.value = input.value.charAt(0);
    }
}

const inputs = Array.from(document.querySelectorAll('input[type="number"]'));
inputs.forEach(input => {
    input.addEventListener('input', () => {
        input.style.border = ''; // remove the border style
    });
});
const sendButton = document.getElementById('send');
sendButton.addEventListener('click', () => {
    const phoneNumber = inputs.reduce((acc, input) => {
        return acc + input.value;
    }, '');
    const providerIndexes = ['514', '551', '555', '557', '558', '568', '571', '574', '577', '579', '591', '592', '593', '595', '596', '597', '598', '599'];
    if (phoneNumber.length !== 9) {
        inputs.forEach(input => {
            if (input.value.length === 0) input.style.border = '1px solid orange';
        });
        inputs.find(input => input.value === '').focus();
    } else if (!providerIndexes.includes(phoneNumber.substring(0, 3))) {
        inputs.slice(0, 3).forEach(input => {
            input.style.border = '1px solid orange';
            input.value = ''; // clear the input value
        });
        inputs[0].focus(); // set focus to the first input
    } else {
        inputs.forEach(input => {
            input.style.border = 'none';
        });
        console.log(phoneNumber, winAmount);
    }
});

function focusOnFirstInput(input) {
    let firstInput = input.parentElement.parentElement.querySelector('input:first-child');
    if (firstInput.value === "") {
        firstInput.focus();
    }
}