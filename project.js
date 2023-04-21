(()=>{

    // scrollY 값 (전체 범위 대비)
    let yOffset = 0;

    // section 내부에서의 scrollY값, section을 넘어가면 0으로 초기화
    let sectionYOffset = 0;

    // 현재 섹션
    let currentSection = 0;

    const sectionSet = [

        // section-0 데이터
        {
            height : 0,
            hMultiple : 3,
            objs : {
                container : document.querySelector("#section-0")
            }
        },

        // section-1 데이터
        {
            height : 0,
            hMultiple : 3,
            objs : {
                container : document.querySelector("#section-1"),
                canvas : document.querySelector("#section1-canvas"),
                ctx : document.querySelector("#section1-canvas").getContext("2d")
            },
            vals : {
                imageCount : 187,
                canvasImages : [],
                imageIndex : [0, 186],
                canvas_fadein_opacity : [0, 1, {start: 0.03, end: 0.21}],
                canvas_fadeout_opacity : [1, 0, {start: 0.72, end: 0.92}],
            }
        },
        
        // section-2 데이터
        {
            height : 0,
            hMultiple : 3,
            objs : {
                container : document.querySelector("#section-2")
            }
        },

        // section-3 데이터
        {
            height : 0,
            hMultiple : 3,
            objs : {
                container : document.querySelector("#section-3")
            }
        }
    ]

    // 레이아웃 설정 초기화 함수
    const setLayout = function()
    {
        // 영상을 보여주기 위해서 최소 높이 설정
        // 1280 x 720
        
        let height = 0;

        if (window.innerHeight < 500)
        {
            height = 500;
        } 
        else
        {
            height = window.innerHeight;
        }

        // 위에서 구한 높이값과 hMultiple 값을 곱해서 객체 내부에 삽입
        for (let i = 0; i < sectionSet.length; i++)
        {
            sectionSet[i].height = height * sectionSet[i].hMultiple;
            sectionSet[i].objs.container.style.height = `${sectionSet[i].height}px`
        }
    }

    // 스크롤 시 현재 섹션 리턴하는 함수
    const getCurrentSection = function ()
    {

        let segment = [
            sectionSet[0].height,
            sectionSet[0].height + sectionSet[1].height,
            sectionSet[0].height + sectionSet[1].height + sectionSet[2].height,
            sectionSet[0].height + sectionSet[1].height + sectionSet[2].height + sectionSet[3].height
        ];

        let section = 0;

        if (yOffset <= segment[0])
        {
            section = 0;
        }
        else if ((yOffset > segment[0]) && (yOffset <=segment[1]))
        {
            section = 1;
        }
        else if ((yOffset > segment[1]) && (yOffset <=segment[2]))
        {
            section = 2;

        }
        else if ((yOffset > segment[2]) && (yOffset <=segment[3]))
        {
            section = 3;

        }
        else
        {
            // 도달하지 않는 공간
            console.error("[ERROR] getCurrentSection()")
        }

        return section;
    }

    // 스크롤 시 섹션 별로 display 상태 전환
    const setBodyID = function(section)
    {
        document.body.setAttribute("id", `show-section${section}`);
    }

    // 스크롤시 네비게이션 상단에 붙이기
    const setLocalnavMenu = function()
    {
        if (yOffset > 44)
        {
            // local 네비게이션 fixed
            document.body.classList.add('local-nav-sticky');
        }
        else
        {
            // local-nav를 원래상태로
            document.body.classList.remove('local-nav-sticky');
        }
    }

    // 이전 섹션의 높이값 반환
    const getPrevSectionHeight = function()
    {
        let prevHeight = 0;

        for (let i = 0; i < currentSection; i++)
        {
            // 이전 섹션의 높이를 각각 더해서 총합을 리턴해줌
            prevHeight = prevHeight + sectionSet[i].height
        }

        return prevHeight
    }

    // 이미지 회전을 위한 캔버스 생성
    const setCanvas = function()
    {
        let imgElement;
        const imageCount = sectionSet[1].vals.imageCount;
        const canvasImages = sectionSet[1].vals.canvasImages;
        const ctx = sectionSet[1].objs.ctx;

        for (let i = 0; i < imageCount; i++)
        {
            imgElement = new Image();
            imgElement.src = `./image/section-1/earth${i}.png`

            canvasImages.push(imgElement);
        }
        
        imgElement.addEventListener('load', ()=>{
            ctx.drawImage(canvasImages[0], 0, 0);
        })
    }

    // 비율 계산
    const calcValue = function(values)
    {
        let result = 0;
        let ratio;

        let partStart = 0;
        let partEnd = 0;
        let partHeight = 0;

        const curHeight = sectionSet[currentSection].height;

        if (values.length === 2)    
        {
            ratio = sectionYOffset / curHeight;
            result = (values[1] - values[0]) * ratio + values[0];

            return result;
        }

        else if (values.length === 3)
        {
            // 시작점
            partStart = values[2].start * curHeight;
            // 끝지점
            partEnd = values[2].end * curHeight;
            // 구간 길이
            partHeight = partEnd - partStart;

            // fade-in 구간 진입 전 고정값 지정
            if (sectionYOffset < partStart)
            {
                // fade-in 구간 진입 전에는
                // fade-in ready 값인 0.03의 값을 리턴
                result = values[0];
            }

            // fade-in 구간 빠져나온 후 ~ fade-out 구간 전 고정값 지정
            else if (sectionYOffset > partEnd)
            {
                // fade-in 구간 지나간 후에는
                // fade-out 마지막 값인 0.12를 리턴
                result = values[1];
            }
            // fade-in 구역 내부에서 opacity에 리턴될 값 계산
            else
            {
                ratio = (sectionYOffset - partStart) / partHeight
                result = (values[1] - values[0]) * ratio + values[0];
            }

            return result;
        }
        else
        {
            console.error("[ERROR] calcValue(), invalid parameter")
        }

    }

    // 애니메이션 함수
    const playAnimation = function()
    {
        let opacity = 0;
        let translateY = 0;
        let scrollRate = sectionYOffset / sectionSet[currentSection].height
        let values = sectionSet[currentSection].vals;
        let objects = sectionSet[currentSection].objs;
        let temp = 0;
        let imgIndex = 0;

        switch(currentSection)
        {
            case 0:
            break;
            
            case 1:

                temp = calcValue(values.imageIndex);
                imgIndex = Math.floor(temp);
                objects.ctx.drawImage(values.canvasImages[imgIndex], 0, 0);
                
                objects.canvas.style.opacity = 0;
               
                // 1. fade-in 처리
                if ((scrollRate >= 0.03) && (scrollRate < 0.53))
                {
                    // fade-in 처리
                    canvasOpacity = calcValue(values.canvas_fadein_opacity);
                    objects.canvas.style.opacity = canvasOpacity;
                }

                else if ((scrollRate >= 0.53) && (scrollRate < 0.72))
                {
                    canvasOpacity = calcValue(values.canvas_fadein_opacity);
                    objects.canvas.style.opacity = canvasOpacity;
                }

                else if ((scrollRate >= 0.72) && (scrollRate < 1))
                {
                    canvasOpacity = calcValue(values.canvas_fadeout_opacity);
                    objects.canvas.style.opacity = canvasOpacity;
                }
                
            break;
            
            case 2:
            break;

            case 3:
            break;
            
            default:
            break;

        }
        

        
    }

    ////////////// 이벤트 리스너 //////////////

    // 처음 로딩 시
    window.addEventListener('load', ()=>{
        setLayout();
        yOffset = window.scrollY;
        currentSection = getCurrentSection();
        setCanvas()
        setBodyID(currentSection);
        setLocalnavMenu();
    })
    

    // 스크롤 될 때마다
    window.addEventListener('scroll', ()=>{
        yOffset = window.scrollY
        currentSection = getCurrentSection();
        sectionYOffset = yOffset - getPrevSectionHeight();
        setBodyID(currentSection);
        setLocalnavMenu();
        playAnimation();
    })

    // 페이지 사이즈 변경될 때마다
    window.addEventListener('resize', ()=>{
        setLayout();

    })
    
    
    










})();