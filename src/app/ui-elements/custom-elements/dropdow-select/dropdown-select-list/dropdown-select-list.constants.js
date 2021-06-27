export const DOM_ELEMENT_CLASS = {
    list: 'dropdown-select-list',
    listItem: 'dropdown-select-list-item'
};

export const TEMPLATES = {
    list: `
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
    `,
    listIem: `
    <li
    class='${DOM_ELEMENT_CLASS.listItem}'
    role='option'
    id='%id%'
    value='%value%'
    aria-label='%ariaLabel%'
    aria-selected='%selected%'
    aria-posinset='%posinset%'
    aria-setsize='%setsize%'
    tabindex='-1'
    >
    %displayValue%
    </li>
    `
};