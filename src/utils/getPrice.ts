export function getPrice(items){
    let account = 0;
    items.forEach(store => {
        store.map(item => {
            if(item.selected){
                let price = parseFloat(item.base_price).toFixed(2);
                let quantity = parseInt(parseInt(item.qty).toFixed(0));
                account += price * quantity
            }
        });
    })

    return account.toFixed(2)
}
