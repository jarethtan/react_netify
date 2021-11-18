import React from 'react'
import {FaPlus} from 'react-icons/fa'
import { useRef } from 'react'

const AddItem = ({newItem, setNewItem, handleSubmit}) => {
    const inputRef = useRef();
    return (
        <form className='addForm' onSubmit={handleSubmit}>
            <label htmlFor="addItem">Add Item</label>
            <input 
                autoFocus
                id='addItem'
                ref={inputRef} /* set this as the default focus. for example if we add an item, the focus will move back to the input box. However we also need to specify the button which will be affect by this default behaviour. for example the submit button below */
                type='text'
                placeholder='Add Item'
                required
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)} /* this line of code is require to change the initial state on the line just above this. So everytime when we type in the input, the 'onChange' attribute will take the words typed in the input and store it as a value which is shown in the line above. */
            />
            <button
                type='submit'
                aria-label='Add Item'
                onClick={() => inputRef.current.focus()} /* this is the button which is affect be the default focus (inputRef) */
            >
                <FaPlus />
            </button>
        </form>
    )
}

export default AddItem
