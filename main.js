// 즉시호출 함수로 생성
(()=>{

    // offset = 기준점으로부터 얼마나 떨어져있는가
    // Scroll-Y 값
    let yOffset = 0;

    // 현재 섹션의 값
    let currentSection = 0;
    
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
                container : document.querySelector("#section-0")
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
        
        return section;
    }

    // 이벤트 리스너
    // DOM에서 받는게 아니기 때문에 window로 접근

    // 스크롤이 일어날 때 이벤트 = 'scroll'
    window.addEventListener('scroll', ()=>{
        yOffset = window.scrollY
        
        currentSection = getCurrentSection();
        console.log(`yOffset = ${yOffset}, section = ${currentSection}`)

    })

    // setLayout 함수가 호출되는 시기
    // 1. 처음 로딩될 때
    window.addEventListener('load', ()=>{
        // load = 필요한 리소스가 모두 로딩되었을 때 그 이후 발생!
        setLayout();
    })

    // 2. 페이지의 사이즈가 변경될 때마다 (유동적으로)
    window.addEventListener('resize', ()=>{
        // resize = 페이지가 리사이즈 될 때마다 발생!
        setLayout();
    })

    

})();