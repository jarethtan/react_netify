import LineItem from './LineItem';

const ItemList = ({items, handleCheck, handleDelete}) => {
    return (
        <ul>
            {items.map((item) => (
                <LineItem
                    key={item.id} /*we can actually remove the key line. This is because we pass the code from LineItem as a prop. However i am leaving it here to inform that we always need a key in a list. */
                    item={item}
                    handleCheck={handleCheck}
                    handleDelete={handleDelete}
                />
            ))}
        </ul>
    )
}

export default ItemList
