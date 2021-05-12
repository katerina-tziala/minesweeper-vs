export const DOM_ELEMENT_CLASS = {
    list: 'dropdown-select-list',
    listItem: 'dropdown-select-list-item'
};

export const TEMPLATE = `
<ul
class='${DOM_ELEMENT_CLASS.list}'
role='listbox'
aria-multiselectable='false'
aria-required='true'
id='exp_elem_list'
tabindex='-1'
aria-label='exp_elem'
aria-activedescendant=''
>
</ul>
`;
