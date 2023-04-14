(()=>{
    // Scroll-Y 값.
    let yOffset = 0;

    // 현재 섹션
    let currentSection = 0;
    let sectionYOffset = 0;

    const sectionSet = [
        // section-0의 정보
        {
            height : 0,
            hMuliple : 5,

            objs : {
                container : document.querySelector("#section-0"),
                messageA : document.querySelector(".section0-message.a"),
                messageB : document.querySelector(".section0-message.b"),
                messageC : document.querySelector(".section0-message.c"),
                messageD : document.querySelector(".section0-message.d"),
            },

            vals : {

                messageA_fade_in :      [0, 1, {start:0.03, end:0.12}], 
                messageA_fade_out :     [1, 0, {start:0.13, end:0.23}], 

            }


        },

        // section-1의 정보
        {
            height : 0,
            hMuliple : 3,

            objs : {
                container : document.querySelector("#section-1"),


            }

        }
    ];

    const setLayout = function()
    {        
        let height = 0;

        
        // 높이가 500px보다 작은경우는 강제로 500으로 설정한다.
        if (window.innerHeight < 500)
        {
            height = 500;
        }
        else
        {
            height = window.innerHeight;
        }

        // 각 섹션의 높이를 설정한다.
        for (let i = 0; i < sectionSet.length; i++)
        {
            sectionSet[i].height = height * sectionSet[i].hMuliple;            
            sectionSet[i].objs.container.style.height = `${sectionSet[i].height}px`;

        }
        
    }


    const getCurrentSection = function()
    {
        let section = 0;

        let segment = [
            sectionSet[0].height,
            sectionSet[0].height + sectionSet[1].height
        ];
        
        if (yOffset <= segment[0])
        {
            section = 0

        }
        else if ((yOffset > segment[0]) && (yOffset <= segment[1]))
        {
            section = 1;
        }
        else
        { 
            // 올일이 없다.
            console.error("[ERROR] getCurrentSection()" + yOffset);
        }

        return section;

    }

    const setBodyID = function(section)
    {        
        document.body.setAttribute("id", `show-section${section}`);
    }

    const setLoaclnavMenu = function()
    {
        if (yOffset > 44)
        {
            document.body.classList.add('local-nav-sticky');
        }
        else
        {
            document.body.classList.remove('local-nav-sticky');
        }

    }

    const getPrevSectionHeight = function()
    {
        let prevHeight = 0;

        for (let i = 0; i < currentSection; i++)
        {
            prevHeight = prevHeight + sectionSet[i].height;

        }




        return prevHeight;

    }
    
    const calcValue = function(values)
    {
        let result = 0;
        
        //[0, 1, {start:0.03, end:0.12}]
        let partStart = 0;
        let partEnd = 0;
        let partHeight = 0;
        let ratio;

        // 현재 섹션의 높이
        const curHeight = sectionSet[currentSection].height;
        
        partStart   = values[2].start * curHeight;
        partEnd     = values[2].end * curHeight;
        partHeight  = partEnd - partStart;


        if (sectionYOffset < partStart)
        {
            result = values[0];

        }
        else if (sectionYOffset > partEnd)
        {
            result = values[1];
        }
        else
        {
            ratio = (sectionYOffset - partStart) / partHeight;
            result = ((values[1] - values[0]) * ratio) + values[0];
        }
        
        return result;

    }


    const playAnimation = function()
    {
        let opacity = 0;
        let scrollRate = sectionYOffset / sectionSet[currentSection].height;

        let values = sectionSet[currentSection].vals;
        let objects = sectionSet[currentSection].objs;

        switch(currentSection)
        {
            case 0:

                if (scrollRate < 0.13)
                {
                    //fade-in 처리를 한다.
                    opacity = calcValue(values.messageA_fade_in);
                    objects.messageA.style.opacity = opacity;

                }
                else if ((scrollRate >= 0.13) && (scrollRate < 0.25))
                {
                    //fade-out 처리를 한다.
                    opacity = calcValue(values.messageA_fade_out);
                    objects.messageA.style.opacity = opacity;

                }
                    
                break;

            case 1:
                console.log("1번 섹션의 애니메이션이 돌고 있어요");
                break;

            default:
                console.error("[ERROR] playAnimation()");
                break;

        }

    }

    /////////////////////////////////////////////////////////////////////////////////
    // 이벤트 리스너
    window.addEventListener('scroll', ()=>{

        // 1. 스크롤 값을 설정한다.
        yOffset = window.scrollY;
        
        // 2. 현재 섹션값을 가지고 온다.
        currentSection = getCurrentSection();

        // sectionYOffset을 구했다.
        sectionYOffset = yOffset - getPrevSectionHeight();

        // CSS 변경...
        setBodyID(currentSection);
        setLoaclnavMenu();


        playAnimation();
    });

    // 웹 페이지가 모든 리소스의 로딩을 완료 했을때.
    window.addEventListener('load', ()=>{

        // 1. 레이아웃을 잡는다.
        setLayout();

        // 2. 스크롤 값을 설정한다.
        yOffset = window.scrollY;

        // 3. 현재 섹션값을 가지고 온다.
        currentSection = getCurrentSection();
        setBodyID(currentSection);
        setLoaclnavMenu()

    });

    window.addEventListener('resize', ()=>{

        // 1. 레이아웃을 다시 잡는다.
        setLayout();

        
    });
    
})();