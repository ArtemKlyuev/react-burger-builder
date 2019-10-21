import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import NavigationItems from './NavigationItems';
import NavigationItem from './NavigationItem/NavigationItem';

configure({ adapter: new Adapter() });

describe('Navigaionitems', () => {
    let wrapper = null;

    beforeEach(() => {
        wrapper = shallow(<NavigationItems />);
    });

    it('shoud render 2 Navigationitem if not authenticated', () => {
        expect(wrapper.find(NavigationItem)).toHaveLength(2);
    });

    it('shoud render 3 Navigationitem if authenticated', () => {
        wrapper.setProps({ isAuth: true });
        expect(wrapper.find(NavigationItem)).toHaveLength(3);
    });

    it('shoud render Logout button', () => {
        wrapper.setProps({ isAuth: true });
        expect(
            wrapper.contains(
                <NavigationItem link="/logout">Logout</NavigationItem>
            )
        ).toEqual(true);
    });
});
