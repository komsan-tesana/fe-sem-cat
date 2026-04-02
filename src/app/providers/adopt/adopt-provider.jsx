import { useState, useEffect } from "react";
import { AdoptContext} from "./adopt-context";
import { useAuth } from "@/app/providers/auth";
import { notification } from "antd";


export function AdoptProvider({ children }) {
  const { getCurrentEmail } = useAuth();
  const [ adoptItems, setAdoptItems] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("adoptItems");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  
  useEffect(() => {
    localStorage.setItem("adoptItems", JSON.stringify(adoptItems));
  }, [adoptItems]);
  
  function addAdopt(cat) {
    const existing = adoptItems.find((item) => item.id === cat.id);
    if (existing) {  
      notification.error({
        title:'Error',
        description:'Existing.'
      });
      return;
    } else {
      notification.success({
        title:'Success',
        description:'Adoption Success.'
      })
      setAdoptItems([
        ...adoptItems,
        {        
          ...cat,         
          user: getCurrentEmail(),
          createdAt: new Date().toISOString(),
        },
      ]);
    }
  }

  function catIsAdopted(cat){
     return adoptItems.find((item) => item.id === cat.id);
  }


  return (
    <AdoptContext.Provider
      value={{
        adoptItems,
        addAdopt,
        catIsAdopted
      }}
    >
      {children}
    </AdoptContext.Provider>
  );
}
