import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [items, setItems] = useState([
    { id: 1, b: 6, w: 1, name: "Apple" }, // the addeble items are here
    { id: 2, b: 10, w: 2, name: "Orange" }, // i hold them in an array and object type
    { id: 3, b: 12, w: 6, name: "Drinks" },
    { id: 4, b: 12, w: 5, name: "Meat" },
    { id: 5, b: 25, w: 10, name: "Oil" },
    { id: 6, b: 11, w: 1, name: "Chips" },
    { id: 7, b: 36, w: 15, name: "Water" },
  ]);
  const [basket, setBasket] = useState([]); // these const values are declarations
  const [sol, setSol] = useState([]);

  const [W, setW] = useState(6);
  const [val, setVal] = useState(0);

  useEffect(() => {
    knapsack(basket, W); // this is a react future, it says every time 'basket' array is changed
  }, [basket]); // call the knapsack function again with the new basket and bag weight

  function knapsack(items, capacity) {
    var idxItem = 0,
      idxWeight = 0,
      oldMax = 0,
      newMax = 0,
      numItems = items.length, // necessary declarations for using knapsack
      weightMatrix = new Array(numItems + 1),
      keepMatrix = new Array(numItems + 1),
      solutionSet = [];

    for (idxItem = 0; idxItem < numItems + 1; idxItem++) {
      weightMatrix[idxItem] = new Array(capacity + 1); // Setup matrices for capacity + 1 because we need top row and left column as 0
      keepMatrix[idxItem] = new Array(capacity + 1);
    }

    for (idxItem = 0; idxItem <= numItems; idxItem++) {
      // build the weightMatrix from [0][0] to [numItems-1][capacity-1]
      for (idxWeight = 0; idxWeight <= capacity; idxWeight++) {
        if (idxItem === 0 || idxWeight === 0) {
          weightMatrix[idxItem][idxWeight] = 0; // Fill top row and left column with 0
        } else if (items[idxItem - 1].w <= idxWeight) {
          // If item will fit, decide if there is a greater value in keeping it or leaving it

          newMax =
            items[idxItem - 1].b +
            weightMatrix[idxItem - 1][idxWeight - items[idxItem - 1].w];
          oldMax = weightMatrix[idxItem - 1][idxWeight];

          if (newMax > oldMax) {
            // Update the matrices if it is bigger or lower then the newmax
            weightMatrix[idxItem][idxWeight] = newMax;
            keepMatrix[idxItem][idxWeight] = 1;
          } else {
            weightMatrix[idxItem][idxWeight] = oldMax;
            keepMatrix[idxItem][idxWeight] = 0;
          }
        } else {
          // Else, item cant fit, value and weight are the same as before
          weightMatrix[idxItem][idxWeight] =
            weightMatrix[idxItem - 1][idxWeight];
        }
      }
    }

    idxWeight = capacity; // Traverse through keepMatrix ([numItems][capacity] to until [1][?]) to create solutionSet
    idxItem = numItems;
    for (idxItem; idxItem > 0; idxItem--) {
      if (keepMatrix[idxItem][idxWeight] === 1) {
        // If it is equal to 1(in javascript it is checking by tree equal sing) we push the [idxItem-1] to solutionSet
        solutionSet.push(items[idxItem - 1]);
        idxWeight = idxWeight - items[idxItem - 1].w; // and update the idxWeight with substract it
      }
    }

    setVal(weightMatrix[numItems][capacity]); // these set functions for setting the values and arrays we have and be able to using for frontend side
    setSol(solutionSet);

    console.log(weightMatrix[numItems][capacity]); // these consol logs are for the debugging you can see them in the 'F12' inspector side
    console.log(sol); // not necessary for work the function, we can delete it if we want
    console.log(solutionSet);
  }

  const callknap = (e) => {
    // 'Knap it' button function, every time we click knapsack will call with current basket and bag weight
    e.preventDefault();
    knapsack(basket, W);
  };
  const addBasket = (item) => {
    // 'Add item' button function, it will adding item to basket by their id inside the object
    // e.preventDefault();
    console.log(basket.findIndex((e) => e.id === item.id));
    setBasket([...basket, item]);
    console.log(basket);
  };

  const removeBasket = (i) => {
    // 'Remove item' button function, it will remove it from basket by their name, we can change this to by their id's
    // because id's are unique but I also use names are unique so it won't break the code
    setBasket(basket.filter((na) => na.name !== i.name));
    console.log(basket);
  };

  return (
    // Frontend side with html + css, i will just write the important parts in this section
    <div className="App">
      <h1>Knapsack Algorithm</h1>
      <p>Bag Max Weight (default 6) </p>
      <input value={W} onChange={(event) => setW(event.target.value)} />{" "}
      {/* This input box is for changing the bag weight */}
      <button onClick={callknap}>Knap it</button>{" "}
      {/* And button for callknap function to call knapsack funtion */}
      <div style={{ display: "flex", marginLeft: "30%" }}>
        <div style={{ marginRight: "100px" }}>
          <h4>Items can be Added</h4>{" "}
          {/* This map method is using for iterate every item in the array one by one, and for each item */}
          {/* we can set unique item id's for button and print the each of them exactly same */}
          {items.map((item) => {
            return (
              <div style={{ border: "1px solid black", marginBottom: "3px" }}>
                <p>
                  Name: {item.name} - Weight: {item.w} - Value: {item.b}
                </p>
                <button
                  disabled={basket.findIndex((e) => e.id === item.id) !== -1}
                  onClick={() => addBasket(item)}
                >
                  Add to Basket
                </button>
              </div>
            );
          })}
        </div>
        <div>
          <h4>Basket Items</h4> {/* Same as items array but for basket array */}
          {basket.map((basket) => {
            return (
              <div style={{ border: "1px solid black", marginBottom: "3px" }}>
                <p>
                  Name: {basket.name} - Weight: {basket.w} - Value: {basket.b}
                </p>
                <button onClick={() => removeBasket(basket)}>
                  Remove from Basket
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ border: "1px solid red", width: "50%", marginLeft: "25%" }}>
        <p>Best Bag Option</p>{" "}
        {/* 'sol' is the solution set after calling the knapsack function for showing the best option, usage is same as items and basket array */}
        {sol.map((s) => {
          return (
            <p>
              Name: {s.name} - Weight: {s.w} - Value: {s.b}
            </p>
          );
        })}
        <p>Total value: {val}</p>{" "}
        {/* Finally the max bag value is shown here */}
      </div>
    </div>
  );
}

export default App;
