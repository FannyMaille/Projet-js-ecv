const initNftCreator = () =>{

    const size = 20;
    const cellSize = 42;
    let nftSize = size * cellSize;

    let nft = {
        creator : '',
        name : '',
        pattern : {},
        size : size
    }
    
    let currentColor = '#123456'
    let showDividers = true;

    let canvas = null;
    let ctx = null;

    const nfts = JSON.parse(localStorage.getItem('nfts')) ?? []

    const mousemove = new Event('mousemove')
    const updateCanvas = new Event('updateCanvas')

    const container = createElement('div', {style: {display: 'flex', justifyContent : 'space-between', padding : '16px 64px', alignItems : 'start'}})

    const makeEditor = () => {
        // Bloc gauche de paramétrage du NFT
        const divEditor = createElement('div', {myclass : 'editor p-2'}, container)

        // Charger un NFT existant (si existe)
        if(nfts.length){
            const blocNft = createElement('div', {style : {display: 'flex', flexDirection : 'column', gap: '4px'}}, divEditor)
            const nftLabel = createElement('label', {text: 'Load an existing NFT', htmlFor : 'nft'}, blocNft)
            const nftSelect = createElement('select', {}, blocNft)
            createElement('option', {value : '', text : '-- Chose one --'}, nftSelect)
            nfts.forEach((nft, index) => {
                createElement('option', {value : `${index}`, text : nft.name}, nftSelect)
            })

            const nftButton = createElement('button', {type: 'button', text: 'Load my NFT', myclass: 'btn mb-2'}, divEditor)
    
            nftButton.addEventListener('click', (e) => {
                nft = nfts[nftSelect.value]
                sizeInput.value = nft.size
                nameInput.value = nft.name
                creatorInput.value = nft.creator
                nftSize = nft.size * cellSize
                canvas.width = nftSize
                canvas.height = nftSize
                canvas.dispatchEvent(updateCanvas)
            })
        }

        // Nom du créateur
        const blocSize = createElement('div', {style : {display: 'flex', flexDirection : 'column', gap: '4px'}}, divEditor)
        const sizeLabel = createElement('label', {text: 'Nb of cells (1 to 20)', htmlFor : 'size'}, blocSize)
        const sizeInput = createElement('input', {type : 'number', max: 20, min : 1, myid : 'size', value : nft.size}, blocSize)

        sizeInput.addEventListener('change', (e) => {
            nft = {...nft, size : e.target.value}
            nftSize = nft.size * cellSize
            canvas.width = nftSize
            canvas.height = nftSize
            canvas.dispatchEvent(updateCanvas)
        })

        // Nom du créateur
        const blocCreator = createElement('div', {style : {display: 'flex', flexDirection : 'column', gap: '4px'}}, divEditor)
        const creatorLabel = createElement('label', {text: 'Creator name', htmlFor : 'creator'}, blocCreator)
        const creatorInput = createElement('input', {type : 'text', myid : 'creator', value : nft.creator}, blocCreator)

        creatorInput.addEventListener('change', (e) => {
            nft = {...nft, creator : e.target.value}
        })

        // Nom du NFT
        const blocName = createElement('div', {style : {display: 'flex', flexDirection : 'column', gap: '4px'}}, divEditor)
        const nameLabel = createElement('label', {text: 'NFT name', htmlFor : 'name'}, blocName)
        const nameInput = createElement('input', {type : 'text', myid : 'name', value : nft.name}, blocName)

        nameInput.addEventListener('change', (e) => {
            nft = {...nft, name : e.target.value}
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
        const dividerTitle = createElement('label', {text : 'Show the grid on the NFT ?'}, blocDividers)
        const dividerRadio = createElement('div', {style : {display: 'flex', gap: '16px'}}, blocDividers)
        const dividersOnBloc = createElement('div', {style : {display: 'flex', gap: '4px', alignItems: 'center'}}, dividerRadio)
        const dividersOnLabel = createElement('label', {text: 'Yes', htmlFor : 'dividersOn'}, dividersOnBloc)
        const dividersOnInput = createElement('input', {type : 'radio', name : 'dividers', value : '1', myid: 'dividersOn', checked: showDividers}, dividersOnBloc)
        const dividersOffBloc = createElement('div', {style : {display: 'flex', gap: '4px', alignItems: 'center'}}, dividerRadio)
        const dividersOffLabel = createElement('label', {text: 'No', htmlFor : 'dividersOff'}, dividersOffBloc)
        const dividersOffInput = createElement('input', {type : 'radio', name : 'dividers', value : '1', myid: 'dividersOff', checked: !showDividers}, dividersOffBloc)

        dividersOnInput.addEventListener('click', (e) => {
            showDividers = true
            canvas.dispatchEvent(updateCanvas)
        })
        dividersOffInput.addEventListener('click', (e) => {
            showDividers = false
            canvas.dispatchEvent(updateCanvas)
        })

        const downloadButton = createElement('button', {type: 'button', text: 'Download my NFT', myclass: 'btn'}, divEditor)

        downloadButton.addEventListener('click', (e) => {
            showDividers = false
            canvas.dispatchEvent(updateCanvas)
            const image = canvas.toDataURL();
            const dl = document.createElement('a');
            dl.download = `${nft.name}.png`;
            dl.href = image;
            dl.click();
            showDividers = true
            canvas.dispatchEvent(updateCanvas)
        })

        const saveButton = createElement('button', {type: 'button', text: 'Save my NFT', myclass: 'btn'}, divEditor)

        saveButton.addEventListener('click', (e) => {
            if(!nft.name.length || !nft.creator.length){
                window.alert('Creator name and NFT name are required !')
            } else {
                let existingNftId = nfts.findIndex(n => n.name == nft.name)
                console.log(existingNftId, nfts, nft)
                if(existingNftId == -1){
                    nfts.push(nft)
                } else {
                    nfts[existingNftId] = nft
                }
                localStorage.setItem('nfts', JSON.stringify(nfts))
                // location.reload();
            }
        })
    }

    const makeCanvas = () => { 
        canvas = createElement('canvas', {id: 'myCanvas', width: nftSize, height: nftSize, style: {border: 'solid 1px #000000'}}, container)
        ctx = canvas.getContext('2d')
        for (let x = 0; x < nftSize; x = x + cellSize) {
            nft.pattern[x] = nft.pattern[x] ?? {}
            for (let y = 0; y < nftSize; y = y + cellSize) {
                nft.pattern[x][y] = nft.pattern[x][y] ?? {}
                let color = "#FFFFFF";
                ctx.fillStyle = color
                ctx.strokeStyle = '#000000';
                ctx.fillRect(x, y, cellSize, cellSize);
                ctx.strokeRect(x, y, cellSize, cellSize);
                ctx.fill()

                nft.pattern[x][y] = color
            }
        }

        const draw = (event) => {
            const rect = canvas.getBoundingClientRect()
            const x = event.clientX - rect.left
            const y = event.clientY - rect.top

            const baseX = Math.floor(x / cellSize) * cellSize
            const baseY = Math.floor(y / cellSize) * cellSize
            
            ctx.fillStyle = currentColor
            ctx.fillRect(baseX, baseY, cellSize, cellSize);
            ctx.fill() 
            if(showDividers){
                ctx.strokeRect(baseX, baseY, cellSize, cellSize);
                ctx.strokeStyle = '#000000';
            }

            nft.pattern[baseX][baseY] = currentColor
        }

        const updateCanvas = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let x = 0; x < nftSize; x = x + cellSize) {
                nft.pattern[x] = nft.pattern[x] ?? {}
                for (let y = 0; y < nftSize; y = y + cellSize) {
                    nft.pattern[x][y] = nft.pattern[x][y] ?? "#FFFFFF"
                    let color = nft.pattern[x][y] ?? "#FFFFFF";
                    ctx.fillStyle = color
                    ctx.fillRect(x, y, cellSize, cellSize);
                    ctx.fill()
                    if(showDividers){
                        ctx.strokeStyle = '#000000';
                        ctx.strokeRect(x, y, cellSize, cellSize);
                        nft.pattern[x][y] = color
                    }
                }
            }
        }

        canvas.addEventListener('mousedown', (e) => {
            draw(e)
            canvas.addEventListener('mousemove', draw)
        })

        canvas.addEventListener('mouseup', () => {
            canvas.removeEventListener('mousemove', draw)
        })

        canvas.addEventListener('updateCanvas', () => {
            updateCanvas();
        })
        
    }



    makeEditor()
    makeCanvas()
}

initNftCreator();