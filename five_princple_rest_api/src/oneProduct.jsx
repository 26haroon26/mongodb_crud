import { useState } from "react";
import "./App.css";
import axios from "axios";

let baseUrl = "";
if (window.location.href.split(":")[0] === "http") {
  baseUrl = "http://localhost:4000";
} else {
  baseUrl = "https://wild-tan-narwhal-kilt.cyclic.app/";
}

function OneProduct() {
  const [istrue, setistrue] = useState(false);
  const [isEdit, setisEdit] = useState(false);
  const [ProductId, setProductId] = useState("");
  const [ProductIdData, setProductIdData] = useState();
  const [EditProductIdData, setEditProductIdData] = useState({
    EditProductIdId: null,
    EditProductIdName: "",
    EditProductIdPrice: "",
    EditProductIdDescription: "",
  });

  const Product = (e) => {
    e.preventDefault();
    axios
      .get(`${baseUrl}/product/${ProductId}`)
      .then((response) => {
        // setgetData([response.data.data])
        setProductIdData(response.data.data);
        setistrue(!istrue);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
  return (
    <>
      <div className="flex b_bottom">
          <form className="newform" onSubmit={Product}>
            <input
              required
              type="number"
              className="input"
              onChange={(e) => {
                setProductId(e.target.value);
              }}
              placeholder="Please Enter Id"
            />
            <input type="submit" className="button" value="Get 1" />
          </form>
            {ProductIdData ? (
              <div className="post">
                <div className="postText">
                  <p className="overflow">
                    {isEdit && ProductIdData.id === EditProductIdData.editingId
                      ? null
                      : `Id :` + ProductIdData?.id}
                  </p>

                  <h3 className="postDescr overflow">
                    {isEdit && ProductIdData.id === EditProductIdData.editingId
                      ? null
                      : `Name :` + ProductIdData?.name}
                  </h3>

                  <span className="overflow">
                    {isEdit && ProductIdData.id === EditProductIdData.editingId
                      ? null
                      : `Price :` + ProductIdData?.price}
                  </span>
                  <p className="overflow">
                    {isEdit && ProductIdData.id === EditProductIdData.editingId
                      ? null
                      : `Description :${ProductIdData?.description}`}
                  </p>
                  <div style={{ margin: "10px auto" }}>
                  </div>
                </div>
              </div>
            ) : null}
      </div>
    </>
  );
}

export default OneProduct;
