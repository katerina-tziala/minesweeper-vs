export const DOM_ELEMENT_CLASS = {
    list: 'dropdown-select-list',
    listItem: 'dropdown-select-list-item'
};

export const TEMPLATE = `
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
`;
