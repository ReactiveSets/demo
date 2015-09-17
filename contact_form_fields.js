/*  contact_form_fields.js
    
    ----
    
    Copyright (C) 2013, Reactive Sets

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
"use strict";

var contact_form_fields = ( this.rs || require( 'toubkal' ) )
  .set(
    [
      {
          id   : 'flow'
        , type : 'hidden'
        , value: 'contact_form'
      },
      
      {
          id   : 'id'
        , type : 'hidden'
        , value: { type: 'UUID' }
      },
      
      {
          id       : 'full-name'
        , type     : 'text'
        , label    : 'Prénom & Nom'
        , style    : { field: 'form-control', label: 'control-label', container: 'form-group' }
        , mandatory: true
      },
      
      {
          id       : 'email'
        , type     : 'email'
        , label    : 'Email'
        , style    : { field: 'form-control', label: 'control-label', container: 'form-group' }
        , mandatory: true
      },
      
      {
          id       : 'company'
        , type     : 'text'
        , label    : 'Société'
        , style    : { field: 'form-control', label: 'control-label', container: 'form-group' }
      },
      
      {
          id       : 'text'
        , type     : 'text_area'
        , label    : 'Message'
        , rows     : 5
        , style    : { field: 'form-control', label: 'control-label', container: 'form-group' }
        , mandatory: true
      }
    ],
    
    { key: [ 'order_id' ], auto_increment: 'order_id' }
  )
  .set_flow( 'contact_form_fields' )
;

if ( typeof module != 'undefined' ) module.exports = contact_form_fields;
