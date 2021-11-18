import Header from './Header';
import Content from './Content';
import Footer from './Footer';
import AddItem from './AddItem';
import SearchItem from './SearchItem'
import { useState, useEffect } from 'react';
import apiRequest from './apiRequest';

function App() {
  const API_URL = 'http://localhost:3500/items'
    /* const [items, setItems] = useState(JSON.parse(localStorage.getItem('shoppingList')) || []); // set initial value (items) to the shopping list stored in the local storage in JSON. || [] is a short curcuit function. In the event the user start the grocery list app, it will not be an empty array, it will be null. Since it is a null, it will cause an error when we start the app as filter from the content component cannot filter a null value. So in the case, if the list is null, it will select an empty array. Rem this is when we first initialise the app and NOT when we delete all the items when we are using the app. when deleting all the item in the app while using the app, it will be an empty array so there will be no error generated. */
  
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState(''); /* initial state should be blank since there should not be any default item to be added. The user has to add it in */
  const [search, setSearch] = useState('');
  const [fetchError, setFetchError] = useState(null);
  const [isLoading, setIsloading] = useState(true); // this initial state is a boolean. Cause we will only use this function once when it is loading, it will always be true. However in the 'fetchItem' function, once it finishes loading, we will set the boolean to false.

  useEffect(() => {
    /* localStorage.setItem('shoppingList', JSON.stringify(items)) // everytime an item is delete/added, it will be stringified and stored into the list */
    const fetchItems = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw Error('Did not receive expected data.');
        }
        const listItems = await response.json();
        setItems(listItems);
        setFetchError(null); /* we want to reset the setFetchError to null in case there is a fetchError set which has an error in there. */
      } catch (err) {
        setFetchError(err.message);
      } finally {
        setIsloading(false); // this line is to verify that the loading of items has ended.
      }
    }
    setTimeout( () => {
      (async () => await fetchItems())()
    },2000) // 2000 is the time to load the list in ms to simulate a loading time. Normally we will not put this. 

  }, []) /* a change in the item list will trigger the function in useEffect */

  const addItem = async (item) => {
    const id = items.length ? items[items.length -1].id + 1 : 1; /* This line tells us that if there items in the list (items.length), from the id of the last item in the list ( items[items.length -1].id ) and + 1. If there is no item on the list, the id will be set to 1 ( : 1 )  */
    const myNewItem = {id, checked:false, item}; /* this is only 'item' because the object which got pass through to this function is the description of the item. in the input field on the AddItem.js file, it stores the value which is the description of the item. */
    const listItems = [...items, myNewItem];
    setItems(listItems)

    const postOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/JSON'
      },
      body: JSON.stringify(myNewItem)
    }

    const result = await apiRequest(API_URL, postOptions); // the apiRequest function only has two outcome. null or there is an error msg. if there is an error msg, result will have a value if not it will be null.
    if (result) setFetchError(result); // the result as mentioned in the line above will be an err msg will will be send to setfetcherror to be handled as an error.
  }

  const handleCheck = async (id) => {
    const listItems = items.map((item) => item.id === id ? {...item, checked: !item.checked} : item); // "checked: !item.checked" means flipping the check status. if it is false, it will go true. if it is true, it will go false. rem we spread the item in the first place because only that way we can get it out of an array.
    setItems(listItems);

    const myItem = items.map((item) => item.id === id);
    const updateOptions = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/JSON'
      },
      body: JSON.stringify({ checked: myItem[0].checked}) // myitem[0] is used because the results from map function on const myItem will produce an array. 
    }
    const reqUrl = `${API_URL}/${id}`;
    const result = await  apiRequest(reqUrl,updateOptions);
    if(result) setFetchError(result)
  }

  const handleDelete = async (id) => {
    const listItems = items.filter((item) => item.id !== id);
    setItems(listItems)

    const deleteOptions = { method: 'DELETE' };
    const reqUrl = `${API_URL}/${id}`;
    const result = await  apiRequest(reqUrl,deleteOptions);
    if(result) setFetchError(result)
  }

  const handleSubmit = (e) => {
    e.preventDefault(); /* This is to prevent the form from refreshing everytime we submit an item. Meaning it will prevent the default behaviour. Since this function is passed to a form in addItem file, we include the prevent default here. */
    if (!newItem) return /* if there is no input in the list, it should not submit anything */
    addItem(newItem) /* newItem comes from the add item input value */
    setNewItem('') /* once submitted, the input will go blank again */
  }

  return (
    <div className="App">
      <Header title="Groceries"/>
      <AddItem 
        newItem={newItem}
        setNewItem={setNewItem}
        handleSubmit={handleSubmit}
      />
      <SearchItem
        search={search}
        setSearch={setSearch}
      />
      <main>
        {isLoading && <p>Loading Items...</p>}
        {fetchError && <p style={{color: 'red'}}> {`Error: ${fetchError}`} </p>}
        {!fetchError && !isLoading && <Content 
          items={items.filter(item => ((item.item).toLowerCase()).includes(search.toLowerCase()))} /* .filter function is a search function in the SearchItem component. The initial state value of search (rem this is ever changing base on my the user input into the input field of SearchItem.js) is pass to the list of items stored in content and filtered out. the 'toLowerCase' codes before 'includes' is to make all description lowercase and the ;toLowerCase' code after 'includes' is to make all the search description lowercase so we can search for all type of items which worrying about upper or lower case. Note that there is no submit button in the search as well. it also searches for item immediately after the user types the first alphabet because we used e.preventDefault() IN the component itself. which means no submit is required and the search will start.  */
          handleCheck={handleCheck}
          handleDelete={handleDelete}
        />}
      </main>
      <Footer 
        length={items.length}
      />
    </div>
  );
}

export default App;
