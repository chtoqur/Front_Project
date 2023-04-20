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
                ctx_A : document.querySelector("#main-canvas-a").getContext("2d"),
                ctx_B : document.querySelector("#main-canvas-b").getContext("2d")
            },
            vals : {
                canvasA_imageCount : 570,
                canvasA_images : [],
                imageIndex_A : [0, 569],
                canvasA_opacity : [0, 1, {start: 0.03, end: 0.5}],
                
                canvasB_imageCount : 600,
                canvasB_images : [],
                imageIndex_B : [0, 599],
                canvasB_opacity : [0, 1, {start: 0.5, end: 0.9}]
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

        let segment = [
            sectionSet[0].height,
            sectionSet[0].height + sectionSet[1].height,
            sectionSet[0].height + sectionSet[1].height + sectionSet[2].height
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
        // let imgElement;
        // let imgElement2;
        // const imageCount_A = sectionSet[1].vals.canvasA_imageCount;
        // const imageCount_B = sectionSet[1].vals.canvasB_imageCount;
        // const canvasImages_A = sectionSet[1].vals.canvasA_images;
        // const canvasImages_B = sectionSet[1].vals.canvasB_images;
        // const ctx_A = sectionSet[1].objs.ctx_A;
        // const ctx_B = sectionSet[1].objs.ctx_B;

        // for (let i = 0; i < imageCount_A; i++)
        // {
        //     imgElement = new Image();
        //     imgElement.src = `./image/apple_${i}.png`

        //     canvasImages_A.push(imgElement);
        // }
        
        // imgElement.addEventListener('load', ()=>{
        //     ctx_A.drawImage(canvasImages_A[0], 0, 0);
        // })

        // for (let i = 0; i < imageCount_B; i++)
        // {
        //     imgElement2 = new Image();
        //     imgElement2.src = `./image/book/book_${i}.png`

        //     canvasImages_B.push(imgElement);
        // }
        
        // imgElement2.addEventListener('load', ()=>{
        //     ctx_B.drawImage(canvasImages_B[0], 0, 0);
        // })
    }

    // 비율 계산
    const calcValue = function(values)
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
        yOffset = window.scrollY;
        currentSection = getCurrentSection();
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

    })

    // 페이지 사이즈 변경될 때마다
    window.addEventListener('resize', ()=>{

    })
    
    
    










})();