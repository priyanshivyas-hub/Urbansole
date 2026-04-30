import { React, useState, useEffect } from "react";
import { Product } from "../index";
import { MdFilterListAlt } from "react-icons/md";
import { FaSort } from "react-icons/fa6";
// import { useHistory } from "react-router-dom";

import styles from "./ProductList.module.css";

function ProductList({ gender }) {
  const [products, setProducts] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(false);

  const link = "http://localhost:9000/products/";

  useEffect(() => {
    fetchProducts();
  }, [gender]);

  const fetchProducts = async (limit) => {
    return await fetch(link + (limit ? `?limit=${limit}` : ""))
      .then((res) => res.json())
      .then((data) => {
        const allProducts = data.documents;

        if (gender) {
          const filteredProducts = allProducts.filter(
            (product) => product.subTitle.toLowerCase() === gender.toLowerCase()
          );
          setProducts(filteredProducts);
        } else {
          setProducts(allProducts);
        }
      });
  };

  const handleShowMore = () => {
    // Fetch more products
    fetchProducts(products.length + 10);
  };

  const handleFilter = () => {
    setShowFilter(!showFilter);
  };
  const handleSortChange = (e) => {
    // Show loading indicator
    setLoading(true);

    if (e.target.value === "price-low-to-high") {
      const sortedProducts = [...products].sort((a, b) => a.price - b.price);
      setProducts(sortedProducts);
    } else if (e.target.value === "price-high-to-low") {
      const sortedProducts = [...products].sort((a, b) => b.price - a.price);
      setProducts(sortedProducts);
    } else if (e.target.value === "newest") {
      const sortedProducts = [...products].sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setProducts(sortedProducts);
    }
    setLoading(false);
  };

  const handleFilterChange = (e) => {
    const { name, checked } = e.target;

    // if (checked
  };

  return (
    <div className={styles.container}>
      <div className={styles.filterWrapper}>
        <div className={styles.filterByContainer} onClick={handleFilter}>
          <MdFilterListAlt className={styles.filterByIcon} />
          <button className={styles.filterByButton}>Filter</button>
        </div>

        {/* Sort by dropdown */}
        <div className={styles.sortByContainer}>
          Sort By:
          <select className={styles.sortBySelect} onChange={handleSortChange}>
            <option value="newest">Newest</option>
            <option value="price-low-to-high">Price: Low-High</option>
            <option value="price-high-to-low">Price: High-low</option>
          </select>
        </div>
      </div>
      <div
        className={`${styles.productList} ${loading ? styles.loading : ""}`}
        id="productList"
      >
        <div
          className={
            styles.filterOptions + " " + (showFilter ? styles.show : "")
          }
        >
          {/* 1. Gender Category dropdown */}
          <div className={styles.filterCategory}>
            {/* Category title */}
            <h3 className={styles.categoryTitle + " " + styles.filterTitle}>
              Category
            </h3>
            {/* Category options */}
            <div className={styles.categoryOptions}>
              <div className={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  id="men"
                  name="men"
                  onChange={handleFilterChange}
                ></input>
                <label htmlFor="men">Men</label>
              </div>
              <div className={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  id="women"
                  name="women"
                  onChange={handleFilterChange}
                ></input>
                <label htmlFor="women">Women</label>
              </div>
              <div className={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  id="kids"
                  name="kids"
                  onChange={handleFilterChange}
                ></input>
                <label htmlFor="kids">Kids</label>
              </div>
            </div>
          </div>

          {/* 3.Shoe Size Category dropdown */}

          <div className={styles.filterCategory}>
            {/* Category title */}
            <h3 className={styles.categoryTitle + " " + styles.filterTitle}>
              Size
            </h3>
            {/* Category options */}
            <div className={styles.categoryOptions}>
              <div className={styles.checkboxContainer}>
                <input type="checkbox" id="size-6" name="size-6"></input>
                <label htmlFor="size-6">6</label>
              </div>
              <div className={styles.checkboxContainer}>
                <input type="checkbox" id="size-7" name="size-7"></input>
                <label htmlFor="size-7">7</label>
              </div>
              <div className={styles.checkboxContainer}>
                <input type="checkbox" id="size-8" name="size-8"></input>
                <label htmlFor="size-8">8</label>
              </div>
              <div className={styles.checkboxContainer}>
                <input type="checkbox" id="size-9" name="size-9"></input>
                <label htmlFor="size-9">9</label>
              </div>
              <div className={styles.checkboxContainer}>
                <input type="checkbox" id="size-10" name="size-10"></input>
                <label htmlFor="size-10">10</label>
              </div>
              <div className={styles.checkboxContainer}>
                <input type="checkbox" id="size-11" name="size-11"></input>
                <label htmlFor="size-11">11</label>
              </div>
            </div>

            {/* 4. Price Range Category dropdown */}
            <div className={styles.filterCategory}>
              {/* Category title */}
              <h3 className={styles.categoryTitle + " " + styles.filterTitle}>
                Price Range
              </h3>
              {/* Category options */}
              <div className={styles.categoryOptions}>
                <div className={styles.checkboxContainer}>
                  {/* range  input*/}
                  <input
                    type="range"
                    id="price-range"
                    name="price-range"
                    min="0"
                    max="500"
                    onChange={handleFilterChange}
                  ></input>
                  <label htmlFor="price-range">0 - 500</label>
                </div>
              </div>
            </div>

            {/* 5. Colors Category dropdown */}
            <div className={styles.filterCategory}>
              {/* Category title */}
              <h3 className={styles.categoryTitle + " " + styles.filterTitle}>
                Colors
              </h3>
              {/* Category options */}
              <div className={styles.categoryOptions}>
                <div className={styles.checkboxContainer}>
                  <input
                    type="checkbox"
                    id="color-red"
                    name="color-red"
                  ></input>
                  <label htmlFor="color-red">Red</label>
                </div>
                <div className={styles.checkboxContainer}>
                  <input
                    type="checkbox"
                    id="color-blue"
                    name="color-blue"
                  ></input>
                  <label htmlFor="color-blue">Blue</label>
                </div>
                <div className={styles.checkboxContainer}>
                  <input
                    type="checkbox"
                    id="color-green"
                    name="color-green"
                  ></input>
                  <label htmlFor="color-green">Green</label>
                </div>
                <div className={styles.checkboxContainer}>
                  <input
                    type="checkbox"
                    id="color-yellow"
                    name="color-yellow"
                  ></input>
                  <label htmlFor="color-yellow">Yellow</label>
                </div>
                <div className={styles.checkboxContainer}>
                  <input
                    type="checkbox"
                    id="color-black"
                    name="color-black"
                  ></input>
                  <label htmlFor="color-black">Black</label>
                </div>
                <div className={styles.checkboxContainer}>
                  <input
                    type="checkbox"
                    id="color-white"
                    name="color-white"
                  ></input>
                  <label htmlFor="color-white">White</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          products.map((product) => {
            return <Product key={product._id} product={product} />;
          })
        )}
      </div>

      {/* show more button */}
      {/* <button className={styles.showMoreButton} onClick={handleShowMore}>
        Show More
      </button> */}
    </div>
  );
}

export default ProductList;
