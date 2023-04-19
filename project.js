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
            hMultiple : 5,
            objs : {
                container : document.querySelector("#section-0")
            }
        },

        // section-1 데이터
        {
            height : 0,
            hMultiple : 3,
            objs : {
                container : document.querySelector("#section-1")
            }
        },
        
        // section-2 데이터
        {
            height : 0,
            hMultiple : 3,
            objs : {
                container : document.querySelector("#section-2")
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

    }

    // 스크롤 시 섹션 별로 display 상태 전환
    const setBodyID = function(section)
    {
        document.body.setAttribute("id", `show-section${section}`);
    }

    // 스크롤시 네비게이션 상단에 붙이기
    const setLocalnavMenu = function()
    {

    }

    // 이전 섹션의 높이값 반환
    const getPrevSectionHeight = function()
    {

    }

    // 이미지 회전을 위한 캔버스 생성
    const setCanvas = function()
    {

    }

    // 비율 계산
    const calcValue = function(value)
    {
        
    }

    // 애니메이션 함수
    const playAnimation = function()
    {

    }

    ////////////// 이벤트 리스너 //////////////

    // 처음 로딩 시
    window.addEventListener('load', ()=>{
        setLayout();
    })
    

    // 스크롤 될 때마다
    window.addEventListener('scroll', ()=>{

    })

    // 페이지 사이즈 변경될 때마다
    window.addEventListener('resize', ()=>{

    })
    
    
    










})();