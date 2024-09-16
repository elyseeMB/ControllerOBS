import { CgController } from "react-icons/cg";
import { TbAutomaticGearbox } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

export function Features() {
  const navigation = useNavigate();
  const handleClick = () => {
    navigation("/features/controller/obs");
  };
  
  
  return <div className="feature-view">
    <h1>Choose what you want to do</h1>
    
    <div className="container__controller">
      <div className="card is-feature">
        <div className="flex gap-small content__feature">
          Autocam
          <TbAutomaticGearbox className="icon"/>
        </div>
      </div>
      
      <div className="card is-feature" onClick={handleClick}>
        <div className="flex gap-small content__feature">
          Controller vidéo
          <CgController className="icon"/>
        </div>
      </div>
      
      
      <div className="card is-feature" disabled>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus accusantium, alias aut autem consequatur cum
        delectus error excepturi, exercitationem illo laborum magnam magni nostrum odit quaerat quis repellendus, sit
        voluptates?
      </div>
    
    </div>
  </div>;
  ;
}