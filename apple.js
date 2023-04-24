// 즉시호출 함수로 생성
(()=>{

    // offset = 기준점으로부터 얼마나 떨어져있는가
    // Scroll-Y 값
    let yOffset = 0;

    // 현재 섹션의 값
    let currentSection = 0;

    // 섹션이 넘어가면 0~부터 다시 시작하는 값
    // 섹션 내부값
    let sectionYOffset = 0;
    
    // section-0과 1의 정보를 넣어서 배열로 생성
    const sectionSet = [
        // section-0의 정보
        {
            height : 0,
            // 높이의 몇 배를 적용할건지
            hMultiple : 5,
            // 매번 쿼리셀렉터 호출이 번거롭기 때문에 objs 생성
            // DOM 정보를 미리 다 가져오기
            objs : {
                container : document.querySelector("#section-0"),
                // section0-message와 a 두가지 클래스가 동시에 있어야 하는 경우
                messageA : document.querySelector(".section0-message.a"),
                messageB : document.querySelector(".section0-message.b"),
                messageC : document.querySelector(".section0-message.c"),
                messageD : document.querySelector(".section0-message.d"),

                canvas : document.querySelector("#main-canvas"),
                ctx : document.querySelector("#main-canvas").getContext("2d")
            },
            // value 값 모아두기
            vals : {

                imageCount : 570,
                canvasImages : [],
                imageIndex : [0, 569],    // {start: 0, end: 1} > 생략

                messageA_fade_in : [0, 1, {start: 0.03, end: 0.12}],
                messageA_fade_out : [1, 0, {start: 0.13, end: 0.23}],

                messageA_transY_in : [0, -30, {start: 0.03, end: 0.12}],
                messageA_transY_out : [-30, -60, {start: 0.13, end: 0.23}],

                messageB_fade_in : [0, 1, {start: 0.28, end: 0.37}],
                messageB_fade_out : [1, 0, {start: 0.38, end: 0.47}],
                messageB_transY_in : [0, -30, {start: 0.28, end: 0.37}],
                messageB_transY_out : [-30, -60, {start: 0.38, end: 0.47}],

                messageC_fade_in : [0, 1, {start: 0.53, end: 0.62}],
                messageC_fade_out : [1, 0, {start: 0.63, end: 0.72}],
                messageC_transY_in : [0, -30, {start: 0.53, end: 0.62}],
                messageC_transY_out : [-30, -60, {start: 0.63, end: 0.72}],

                messageD_fade_in : [0, 1, {start: 0.78, end: 0.87}],
                messageD_fade_out : [1, 0, {start: 0.88, end: 0.92}],
                messageD_transY_in : [0, -30, {start: 0.78, end: 0.87}],
                messageD_transY_out : [-30, -60, {start: 0.88, end: 0.92}],
                canvas_opacity : [1, 0, {start: 0.85, end: 0.92}]


            }
        },
        // section-1의 정보
        {
            height : 0,
            hMultiple : 3,
            objs : {
                container : document.querySelector("#section-1")
            }
        }
    ];

    // 객체 vals의 fade-in, fade-out 값 넣어주면 css값 출력해주는 함수 생성

    
    // layout 관련된 요소들을 초기화
    const setLayout = function()
    {   
        // 이미지를 보여주기 위해서 최소 높이를 설정해주기
        // 최소 높이보다 작은경우는 강제로 높이를 설정한다

        let height = 0;

        if (window.innerHeight < 500)
        {
            // 강제로 높이를 설정
            height = 500;
        }
        else
        {
            // 최소 높이를 충족한다면 브라우저의 높이를 그대로 적용
            height = window.innerHeight;
        }

        // 위에서 구한 높이값을 가지고 각 섹션의 설정값으로 넣어준다.
        for (let i = 0; i < sectionSet.length; i++)
        {
            sectionSet[i].height = height * sectionSet[i].hMultiple;
            sectionSet[i].objs.container.style.height = `${sectionSet[i].height}px`
        }
    
    }

    // 스크롤링할 때 현재 섹션이 어디인지 가져오는 함수
    const getCurrentSection = function()
    {
        // 섹션의 높이 정보, 스크롤 값을 알고 있어야 함
        
        // segment = 부분부분, 덩어리
        let segment = [
            // 배열로 만드는 이유
            // 섹션이 2개가 아니라 3개 이상이 되면 섹션도 늘어남
            sectionSet[0].height,
            sectionSet[0].height + sectionSet[1].height
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
        else
        {
            // 도달하지 않는 공간
            console.error("[ERROR] getCurrentSection()")
        }
        
        // console.log("curSection = " + section)
        return section;
    }

    // 스크롤 될 때마다 섹션 별로 display 상태 변환
    const setBodyID = function(section)
    {
        document.body.setAttribute("id", `show-section${section}`);
        
    }

    // 스크롤 시 local-nav 상단에 붙이기
    // 파라메터가 없는 함수 = 고정된 값으로 바꾸는 것
    const setLocalnavMenu = function()
    {
        if (yOffset > 44)
        {
            // local-nav를 fixed 시키기

            // 클래스는 여러개이기 때문에 classlist사용
            document.body.classList.add('local-nav-sticky');
        }
        else
        {
            // local-nav를 원래상태로
            document.body.classList.remove('local-nav-sticky');
        }
    }

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

    const setCanvas = function()
    {
        let imgElement;
        const imageCount = sectionSet[0].vals.imageCount;
        const canvasImages = sectionSet[0].vals.canvasImages;
        const ctx = sectionSet[0].objs.ctx;

        for (let i = 0; i < imageCount; i++)
        {
            imgElement = new Image();
            imgElement.src = `./image/apple/apple_${i}.png`

            canvasImages.push(imgElement);
        }
        
        imgElement.addEventListener('load', ()=>{
            ctx.drawImage(canvasImages[0], 0, 0);
        })

    }

    const calcValue = function(values)
    {
        
        let result = 0;     // 최종 리턴값 (CSS)
        let ratio;          // 비율값

        // 아래는 부분애니메이션 실행 시 사용되는 변수
        // [0, 1, {start: 0.03, end: 0.12}]
        
        let partStart = 0;
        let partEnd = 0;
        let partHeight = 0;

        // 현재 섹션의 높이
        const curHeight = sectionSet[currentSection].height;

        // start, end 값이 들어오지 않고 디폴트인 경우
        // 섹션 내부 전체범위에서 opacity 조정되도록
        if (values.length === 2)    
        {
            // 1. 비율을 구한다.
            ratio = sectionYOffset / curHeight;

            // 2. 비율에 따른 CSS값을 구한다.
            result = (values[1] - values[0]) * ratio + values[0];

            return result;
        }

        else if (values.length === 3)
        {
            // fade-in 시작점
            partStart = values[2].start * curHeight;
            // fade-in 끝나는 지점
            partEnd = values[2].end * curHeight;
            // fade-in 구간 길이
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

    const playAnimation = function()
    {
        let opacity = 0;
        let translateY = 0;
        // 0부터 1사이의 값
        // if문의 조건 변수
        let scrollRate = sectionYOffset / sectionSet[currentSection].height

        let values = sectionSet[currentSection].vals;
        // messageA_fade_in : [0, 1, {start: 0.03, end: 0.12}],
        let objects = sectionSet[currentSection].objs;
        // messageA : document.querySelector(".section0-message.a"),

        let temp = 0;
        let imgIndex = 0;
        
        switch(currentSection)
        {   
            case 0:

                // 이미지 인덱스를 정수로 바꾼다.
                temp = calcValue(values.imageIndex);
                imgIndex = Math.floor(temp);

                // 이미지 인덱스에 해당하는 이미지를 ctx에 출력한다.
                objects.ctx.drawImage(values.canvasImages[imgIndex], 0, 0);
                
                // case문으로 진입할 때 초기화 시켜줌
                // 스크롤 할 때 초기화가 진행되고 진행되므로 이런 현상이 발생하지 않음
                objects.messageA.style.opacity = 0;
                objects.messageB.style.opacity = 0;
                objects.messageC.style.opacity = 0;
                objects.messageD.style.opacity = 0;
               
                // 'a'구간
                // 1. fade-in 처리
                if (scrollRate < 0.13)
                {
                    // fade-in 처리
                    // [0, 1, {start: 0.03, end: 0.12}]
                    opacity = calcValue(values.messageA_fade_in);
                    objects.messageA.style.opacity = opacity;

                    // translateY를 처리한다.
                    translateY = calcValue(values.messageA_transY_in);
                    objects.messageA.style.transform = `translateY(${translateY}%)`
                }
                else if ((scrollRate >= 0.13) && (scrollRate < 0.25))
                {
                    // fade-out 처리
                    // [1, 0, {start: 0.13, end: 0.23}

                    opacity = calcValue(values.messageA_fade_out);
                    objects.messageA.style.opacity = opacity;

                    // translateY를 처리한다.
                    translateY = calcValue(values.messageA_transY_out);
                    objects.messageA.style.transform = `translateY(${translateY}%)`
                }

                // b구간
                else if ((scrollRate >= 0.25) && (scrollRate < 0.38))
                {
                    opacity = calcValue(values.messageB_fade_in);
                    objects.messageB.style.opacity = opacity;

                    translateY = calcValue(values.messageB_transY_in);
                    objects.messageB.style.transform = `translateY(${translateY}%)`
                }
                else if ((scrollRate >= 0.38) && (scrollRate < 0.5))
                {
                    opacity = calcValue(values.messageB_fade_out);
                    objects.messageB.style.opacity = opacity;

                    translateY = calcValue(values.messageB_transY_out);
                    objects.messageB.style.transform = `translateY(${translateY}%)`
                }

                // c구간
                else if ((scrollRate >= 0.5) && (scrollRate < 0.63))
                {
                    opacity = calcValue(values.messageC_fade_in);
                    objects.messageC.style.opacity = opacity;

                    translateY = calcValue(values.messageC_transY_in);
                    objects.messageC.style.transform = `translateY(${translateY}%)`
                }
                else if ((scrollRate >= 0.63) && (scrollRate < 0.75))
                {
                    opacity = calcValue(values.messageC_fade_out);
                    objects.messageC.style.opacity = opacity;

                    translateY = calcValue(values.messageC_transY_out);
                    objects.messageC.style.transform = `translateY(${translateY}%)`
                }

                // d구간
                else if ((scrollRate >= 0.75) && (scrollRate < 0.88))
                {
                    opacity = calcValue(values.messageD_fade_in);
                    objects.messageD.style.opacity = opacity;

                    translateY = calcValue(values.messageD_transY_in);
                    objects.messageD.style.transform = `translateY(${translateY}%)`
                }
                else if ((scrollRate >= 0.88) && (scrollRate < 1))
                {
                    opacity = calcValue(values.messageD_fade_out);
                    objects.messageD.style.opacity = opacity;

                    translateY = calcValue(values.messageD_transY_out);
                    objects.messageD.style.transform = `translateY(${translateY}%)`
                }

                if((scrollRate >= 0.85) && (scrollRate < 0.92))
                {
                    canvasOpacity = calcValue(values.canvas_opacity);
                    objects.canvas.style.opacity = canvasOpacity;
                }

                break;

            case 1:
                // console.log("1번 섹션 애니메이션 실행 중")
            break;

            default:
                console.error("playAnimation()");
            break;
        }
    }

    ////////////////////////////////// 이벤트 리스너 //////////////////////////////////
    // DOM에서 받는게 아니기 때문에 window로 접근

    // 스크롤이 일어날 때 이벤트 = 'scroll'
    window.addEventListener('scroll', ()=>{

        // 1. 스크롤 값을 다시 설정한다.
        yOffset = window.scrollY

        // 2. 현재 섹션값을 가지고 온다.
        // currentSection을 단순히 getCurrentSection 함수 내부에서 구할 수도 있지만
        // 굳이 section을 리턴값으로 받아서 currentSection에 리턴한 이유는 리더빌리티 때문임
        currentSection = getCurrentSection();

        // sectionYOffset을 구한다.
        // yOffset값에서 이전 섹션의 높이를 뺀다(getPrevSectionHeight 함수 생성)
        sectionYOffset = yOffset - getPrevSectionHeight();

        // CSS 변경
        setBodyID(currentSection);
        setLocalnavMenu();

        playAnimation();
        

    })

    // setLayout 함수가 호출되는 시기
    // 1. 처음 로딩될 때
    window.addEventListener('load', ()=>{
        // load = 필요한 리소스가 모두 로딩되었을 때 그 이후 발생!

        // 1. 레이아웃을 다시 잡는다.
        setLayout();

        // 2. 스크롤 값을 다시 설정한다.
        yOffset = window.scrollY;

        // 3. 현재 섹션값을 가지고 온다.
        currentSection = getCurrentSection();

        // 4. 캔버스에 이미지를 로딩하고 0번 이미지를 출력하는 함수.
        setCanvas();


        setBodyID(currentSection);
        setLocalnavMenu();
        
    })

    // 2. 페이지의 사이즈가 변경될 때마다 (유동적으로)
    window.addEventListener('resize', ()=>{
        // resize = 페이지가 리사이즈 될 때마다 발생!

        // 1. 레이아웃을 다시 잡는다.
        setLayout();

    })
})();