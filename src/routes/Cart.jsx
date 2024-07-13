import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CartBox from "../ui/cart/CartBox";
import useCartList from "../features/cart/useCartList";
import emptyCart from "../Assets/images/emptyCart.svg";
import { useDispatch, useSelector } from "react-redux";
import { updateEntireCart } from "../redux/slices/cart";
import { deleteCart } from "../services/apiCart";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import DataLoader from "../ui/DataLoader";

const Cart = () => {
  const { data: cartQuery, isLoading } = useCartList();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cartList);
  const [cartObjList, setCartObjList] = useState([]);

  useEffect(() => {
    if (cartQuery?.data?.length > 0) {
      const newCartObjList = cartQuery.data.map((item) => ({
        service_id: item?.service?.id,
        quantity: item?.quantity,
        developments: item?.service?.developments
          ?.filter((dev) => dev.in_cart !== false)
          .map((dev) => dev.id),
      }));

      setCartObjList(newCartObjList);
    }
  }, [cartQuery]);

  useEffect(() => {
    function handleCartChange() {
      dispatch(
        updateEntireCart(
          cartQuery?.data?.map((item) => ({
            id: item.id,
            service_id: item.service?.id,
            quantity: item.quantity,
            developments: item?.service?.developments?.map(
              (dev) => dev.in_cart === false && dev.id
            ),
          }))
        )
      );
    }

    window.addEventListener("load", handleCartChange);
    return () => window.removeEventListener("load", handleCartChange);
  }, [cartQuery, dispatch]);

  const queryClient = useQueryClient();
  const handleDelete = async () => {
    try {
      await deleteCart(queryClient);
      toast.success(t("cart.cartDelted"));
    } catch (error) {
      console.error(error);
    }
  };

  const handleCheckboxChange = (id) => {
    // setCartObjList((prevCartObj) => {
    //   const newDevelopments = prevCartObj.developments.includes(id)
    //     ? prevCartObj.developments.filter((devId) => devId !== id)
    //     : [...prevCartObj.developments, id];

    //   return {
    //     ...prevCartObj,
    //     developments: newDevelopments,
    //   };
    // });

    dispatch(
      updateSpesificItem({
        ...cartObjList,
        developments: cartObjList.developments.includes(id)
          ? cartObjList.developments.filter((devId) => devId !== id)
          : [...cartObjList.developments, id],
      })
    );
  };

  console.log(isLoading);

  return isLoading ? (
    <DataLoader />
  ) : (
    <section className="cart-section container">
      <div className="row">
        {cartQuery?.data && cartQuery?.data?.length > 0 ? (
          <div className="col-12 p-2">
            {cartQuery?.data?.map((item) => (
              <CartBox item={item} key={item.id} cartObjList={cartObjList} />
            ))}
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-6 col-md-6 col-12">
                  <Link className="order-now" to="/checkout">
                    {t("services.orderNow")}
                  </Link>
                </div>
                <div className="col-lg-6 col-md-6 col-12">
                  <button onClick={handleDelete} className="order-now delete">
                    {t("cart.deleteCart")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="col-12 p-2">
            <div className="empty_cart">
              <img src={emptyCart} alt="empty-cart" />
              <h3>{t("cart.empty")}</h3>
              <Link to="/search">{t("cart.exploreServices")}</Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Cart;
