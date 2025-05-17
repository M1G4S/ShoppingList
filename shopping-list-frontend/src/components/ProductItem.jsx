import { useEffect, useRef } from "react";
import {
  MenuIcon,
  Dot,
  OptionsMenu,
  OptionButton,
  Product,
  ProductImage,
} from '../styles/StyledComponents';

export default function ProductItem({
  product,
  isMenuOpen,
  setMenuOpen,
  handleEdit,
  handleDelete,
  onClickProduct,
  showEditForm,
  selectedProduct,
  AddProductForm,
  handleProductAdded,
  setShowForm,
  setShowEditForm,
  setSelectedProduct,
}) {
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setMenuOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setMenuOpen]);

  const toggleMenu = () => {
    setMenuOpen(isMenuOpen ? null : product.id);
  };

  return (
    <div>
      <Product onClick={(e) => onClickProduct(e, product)}>
        <ProductImage src={product.imagemUrl} />
        <h3>{product.nome}</h3>

        <div style={{ position: "relative" }}>
          <MenuIcon ref={buttonRef} onClick={(e) => {
            e.stopPropagation();
            toggleMenu();
          }}>
            <Dot />
            <Dot />
            <Dot />
          </MenuIcon>

          <OptionsMenu $isOpen={isMenuOpen} ref={menuRef}>
            <OptionButton onClick={(e) => {
              e.stopPropagation();
              handleEdit(product);
            }}>
              ✏️ Editar
            </OptionButton>
            <OptionButton onClick={(e) => {
              e.stopPropagation();
              handleDelete(product);
            }}>
              🗑️ Excluir
            </OptionButton>
          </OptionsMenu>
        </div>
      </Product>

      {showEditForm && selectedProduct?.id === product.id && (
        <div style={{ marginTop: "10px" }}>
          <AddProductForm
            onProductAdded={handleProductAdded}
            existingProduct={selectedProduct}
            onClose={() => {
              setShowForm(false);
              setShowEditForm(false);
              setSelectedProduct(null);
            }}
          />
        </div>
      )}
    </div>
  );
}
