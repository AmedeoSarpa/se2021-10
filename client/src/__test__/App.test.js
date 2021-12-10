//UNIT TEST 

//Configuration Enzyme
import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
Enzyme.configure({ adapter: new Adapter() });
import { shallow, mount, render } from 'enzyme';
import toJson from 'enzyme-to-json'
//Test every function in Officer.js 
import  App  from '../App';


it("renders app without crashing", () => {
    const wrapper = mount(<App/>)
    expect(toJson(wrapper)).toMatchSnapshot()
})



