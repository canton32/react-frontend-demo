import React from 'react'
import ResponsiveModal from 'react-responsive-modal'
import CloseIconPath from './CloseIconPath'
import './Modal.scss'

export default ({ open, onClose, children }) => (
  <ResponsiveModal
    open={open}
    onClose={onClose}
    closeOnOverlayClick={false}
    closeIconSize={36}
    closeIconSvgPath={<CloseIconPath />}
    classNames={{ overlay: 'numeos-modal-overlay', modal: 'numeos-modal-content', closeIcon: 'numeos-modal-closeIcon' }}
  >
    {children}
  </ResponsiveModal>
)
