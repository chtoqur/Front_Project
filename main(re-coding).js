(()=>{

    let yOffset = 0;
    let currentSection = 0;

    // section 0과 1의 정보를 객체 내부에 담아서 배열로 생성
    let sectionSet = [
        {
            height : 0,
            hMultiple : 5,
            objs : {
                container : document.querySelector("#section-0")
            }
        },
        {
            height : 0,
            hMultiple : 3,
            objs : {
                container : document.querySelector("#section-1")
            }
        }
    ]

    // 레이아웃 설정 함수 생성

    const setLayout = function ()
    {
        let height = 0;

        if (window.innerHeight < 500)
        {
            height = 500;
        }
        else
        {
            height = window.innerHeight;
        }

        for (let i = 0; i < sectionSet.length; i++)
        {
            sectionSet[i].height = height * sectionSet[i].hMultiple
            sectionSet[i].objs.container.style.height = `${sectionSet[i].height}px`
            
        }
    }

    // 레이아웃 함수가 호출되는 두 가지 경우
    
    // 1. 처음 로딩화면
    window.addEventListener('load', ()=>{
        setLayout();
    })

    // 2. 브라우저 창이 변경되었을 때
    window.addEventListener('resize', ()=>{
        setLayout();
    })

    // 스크롤 될 때 값을 알아야 함
    


})();