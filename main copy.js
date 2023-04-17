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
                messageD : document.querySelector(".section0-message.d")
            },
            // value 값 모아두기
            vals : {
                messageA_fade_in : [0, 1, {start: 0.03, end: 0.12}],
                messageA_fade_out : [1, 0, {start: 0.13, end: 0.23}],
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

    

    const setLayout = function()
    {   
        // 이미지를 보여주기 위해서 최소 높이를 설정해주기
        // 최소 높이보다 작은경우는 강제로 높이를 설정한다

        let height = 0;

        console.log("[CALL] setlayout()")

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

    const calcValue = function(values)
    {
        // 최종 리턴값
        let result = 0;

        // [0, 1, {start: 0.03, end: 0.12}]
        
        let partStart = 0;
        let partEnd = 0;
        let partHeight = 0;

        // 현재 섹션의 높이
        const curHeight = sectionSet[currentSection].height;
        
        // fade-in 시작점
        partStart = values[2].start * curHeight;
        // fade-in 끝나는 지점
        partEnd = values[2].end * curHeight;
        // fade-in 구간 길이
        partHeight = partEnd - partStart;

        if (values.lenght === 2)    
        {
            // 1. 비율을 구한다.
            ratio = sectionYOffset / curHeight;

            // 2. 비율에 따른 CSS값을 구한다.
            result = (values[1] - values[0]) * ratio + values[0];

            return result;
        }

        else if (values.length === 3)
        {

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
    }

    const playAnimation = function()
    {
        let opacity = 0;

        // 0부터 1사이의 값
        // if문의 조건 변수
        let scrollRate = sectionYOffset / sectionSet[currentSection].height

        let values = sectionSet[currentSection].vals;
        // messageA_fade_in : [0, 1, {start: 0.03, end: 0.12}],
        let objects = sectionSet[currentSection].objs;
        // messageA : document.querySelector(".section0-message.a"),
        
        switch(currentSection)
        {   
            case 0:

                // 'a'구간

                opacity = calcValue([1, 0]);
                objects.messageA.style.opacity = opacity;
                

                // 1. fade-in 처리
                // if (scrollRate < 0.13)
                // {
                //     // fade-in 처리
                //     // [0, 1, {start: 0.03, end: 0.12}]
                //     opacity = calcValue(values.messageA_fade_in);
                //     objects.messageA.style.opacity = opacity;
                // }
                // else if ((scrollRate >= 0.13) && (scrollRate < 0.25))
                // {
                //     // fade-out 처리
                //     // [1, 0, {start: 0.13, end: 0.23}

                //     opacity = calcValue(values.messageA_fade_out);
                //     objects.messageA.style.opacity = opacity;

                // }
            break;

            case 1:
                console.log("1번 섹션 애니메이션 실행 중")
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