import React, {useState} from "react";

function Filter(props) {

    const [size, setSize] = useState("ALL");
    const [sort, setSort] = useState("");

    function handleSize(event) {
        setSize(event.target.value);
        props.filterProduct(event);
        setSort("Latest");
    }

    function handleSort(event) {
        setSort(event.target.value);
        props.sortProducts(event);

    }

    return(
        <div className="filter">
            <div className="filter-result">{props.count} Products</div>
            <div className="filter-sort">
                Sort {" "} <select value = {sort} onChange= {handleSort}>
                    <option>Latest</option>
                    <option value="lowest">Lowest</option>
                    <option value="highest">Highest</option>
                </select>
            </div>
            <div className="filter-size">
                Filter {" "}
                <select value = {size} onChange= {handleSize}>
                    <option value="ALL">ALL</option>
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                </select>
            </div>
        </div>
    );
}

export default Filter;