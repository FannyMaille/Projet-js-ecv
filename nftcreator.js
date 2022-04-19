const initNftCreator = () =>{

    const cells = 20;
    const size = cells * 42;
    const step = size / cells;

    const nft = {
        creator : '',
        name : '',
        pattern : {},
        size : size
    }

    let currentColor = '#123456'
    let showDividers = true;

    let canvas = null;
    let ctx = null;

    const container = createElement('div', {style: {display: 'flex', gap : '128px'}})

    const makeEditor = () => {
        // Bloc gauche de paramétrage du NFT
        const divEditor = createElement('div', {myclass : 'editor'}, container)

        // Nom du créateur
        const blocCreator = createElement('div', {style : {display: 'flex', flexDirection : 'column', gap: '4px'}}, divEditor)
        const creatorLabel = createElement('label', {text: 'Creator name', htmlFor : 'creator'}, blocCreator)
        const creatorInput = createElement('input', {type : 'text', myid : 'creator', value : nft.creator}, blocCreator)

        creatorInput.addEventListener('change', (e) => {
            nft.creator = e.target.value
        })

        // Nom du NFT
        const blocName = createElement('div', {style : {display: 'flex', flexDirection : 'column', gap: '4px'}}, divEditor)
        const nameLabel = createElement('label', {text: 'NFT name', htmlFor : 'name'}, blocName)
        const nameInput = createElement('input', {type : 'text', myid : 'name', value : nft.name}, blocName)

        nameInput.addEventListener('change', (e) => {
            nft.name = e.target.value
        })

        // Choix de la couleur
        const blocColor = createElement('div', {style : {display: 'flex', flexDirection : 'column', gap: '4px'}}, divEditor)
        const colorLabel = createElement('label', {text: 'Color', htmlFor : 'color'}, blocColor)
        const colorInput = createElement('input', {type : 'color', myid : 'color', value : currentColor}, blocColor)

        colorInput.addEventListener('change', (e) => {
            currentColor = e.target.value
        })

        // Afficher / masquer le quadrillage
        const blocDividers = createElement('div', {style : {display: 'flex', flexDirection : 'column', gap: '4px'}}, divEditor)
        const dividersOnBloc = createElement('div', {style : {display: 'flex', gap: '4px'}}, blocDividers)
        const dividersOnLabel = createElement('label', {text: 'Yes', htmlFor : 'dividersOn'}, dividersOnBloc)
        const dividersOnInput = createElement('input', {type : 'radio', name : 'dividers', value : '1', myid: 'dividersOn', checked: showDividers}, dividersOnBloc)
        const dividersOffBloc = createElement('div', {style : {display: 'flex', gap: '4px'}}, blocDividers)
        const dividersOffLabel = createElement('label', {text: 'No', htmlFor : 'dividersOff'}, dividersOffBloc)
        const dividersOffInput = createElement('input', {type : 'radio', name : 'dividers', value : '1', myid: 'dividersOff', checked: !showDividers}, dividersOffBloc)

        const event = new Event('toggleDividers')
        dividersOnInput.addEventListener('click', (e) => {
            showDividers = true
            canvas.dispatchEvent(event)
        })
        dividersOffInput.addEventListener('click', (e) => {
            showDividers = false
            canvas.dispatchEvent(event)
        })

        const downloadButton = createElement('button', {type: 'button', text: 'Download my NFT', myclass: 'btn'}, divEditor)

        downloadButton.addEventListener('click', (e) => {
        })
    }

    const makeCanvas = () => { 
        canvas = createElement('canvas', {width: size, height: size, style: {border: 'solid 1px #000000'}}, container)
        ctx = canvas.getContext('2d')
        for (let x = 0; x < size; x = x + step) {
            nft.pattern[x] = nft.pattern[x] ?? {}
            for (let y = 0; y < size; y = y + step) {
                nft.pattern[x][y] = nft.pattern[x][y] ?? {}
                let color = "#FFFFFF";
                ctx.fillStyle = color
                ctx.strokeStyle = '#000000';
                ctx.fillRect(x, y, step, step);
                ctx.strokeRect(x, y, step, step);
                ctx.fill()

                nft.pattern[x][y] = color
            }
        }

        const draw = (event) => {
            const rect = canvas.getBoundingClientRect()
            const x = event.clientX - rect.left
            const y = event.clientY - rect.top

            const baseX = Math.floor(x / step) * step
            const baseY = Math.floor(y / step) * step
            
            ctx.fillStyle = currentColor
            ctx.fillRect(baseX, baseY, step, step);
            ctx.fill() 
            if(showDividers){
                ctx.strokeRect(baseX, baseY, step, step);
                ctx.strokeStyle = '#000000';
            }

            nft.pattern[baseX][baseY] = currentColor
        }

        const toggleDividers = () => {
            console.log(nft.pattern)
            for (let x = 0; x < size; x = x + step) {
                nft.pattern[x] = nft.pattern[x] ?? {}
                for (let y = 0; y < size; y = y + step) {
                    nft.pattern[x][y] = nft.pattern[x][y] ?? "#FFFFFF"
                    let color = nft.pattern[x][y] ?? "#FFFFFF";
                    ctx.fillStyle = color
                    ctx.fillRect(x, y, step, step);
                    ctx.fill()
                    if(showDividers){
                        ctx.strokeStyle = '#000000';
                        ctx.strokeRect(x, y, step, step);
                        nft.pattern[x][y] = color
                    }
                }
            }
        }

        canvas.addEventListener('mousedown', () => {
            canvas.addEventListener('mousemove', draw)
        })

        canvas.addEventListener('mouseup', () => {
            canvas.removeEventListener('mousemove', draw)
        })

        canvas.addEventListener('toggleDividers', () => {
            toggleDividers();
        })
        
    }



    makeEditor()
    makeCanvas()
}

initNftCreator();