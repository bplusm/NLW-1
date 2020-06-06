

function populateUFs() {
    const ufSelect = document.querySelector("select[name=uf]")

    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
        .then((res) => { return res.json() })
        .then(states => {
            for (state of states) {
                ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`
            }
        })
}

populateUFs()

function getCities(event) {
    const citySelect = document.querySelector("select[name=city]")
    const stateInput = document.querySelector("input[name=state]")

    const ufValue = event.target.value

    const indexOfSlectedState = event.target.selectedIndex
    stateInput.value = event.target.options[indexOfSlectedState].text

    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`


    citySelect.innerHTML = "<option value>Selecione a Cidade</option>"
    citySelect.disabled = true

    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`)
        .then((res) => { return res.json() })
        .then(cities => {

            for (city of cities) {
                citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`
            }

            citySelect.disabled = false

        })
}



document
    .querySelector("select[name=uf]")
    .addEventListener("change", getCities)




//itens de coleta


const itemsToCollect = document.querySelectorAll(".items-grid li")

for (const item of itemsToCollect) {
    item.addEventListener("click", handleSelectedItem)
}

const collectedItems = document.querySelector("input[name=items]")

let selectedItems = []


function handleSelectedItem(event) {
    const itemLi = event.target

    //add or remove class with js
    itemLi.classList.toggle("selected")

    const itemId = itemLi.dataset.id

    // verificando
    console.log("ITEM ID: ", itemId)

    //verificar se existem itens selecionados
    //se sim pegar os itens selecionados

    const alreadySelected = selectedItems.findIndex(function (item) {
        const itemFound = item == itemId //isso retorna true or false
        return itemFound
    })


    //se ja estiver selecionado, 

    if (alreadySelected >= 0) {
        //tirar da selação
        const filteredItems = selectedItems.filter(item => {
            const itemIsDifferent = item != itemId
            return itemIsDifferent
        })

        selectedItems = filteredItems

    } else {
        //se não estiver selecionado, adicionar a seleção
        selectedItems.push(itemId)
    }

    // verificando
    console.log("SELECTED ITEMS: ", selectedItems)

    console.log(selectedItems)

    //atualizar o campo escondido com os itens selecionados
    collectedItems.value = selectedItems

}

