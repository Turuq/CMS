import { CircleDashedIcon, ClockIcon } from 'lucide-react';

export const statusIcons: { [key: string]: JSX.Element } = {
  pending: <CircleDashedIcon size={16} strokeWidth={2} />,
  processing: <ClockIcon size={16} strokeWidth={2} />,
  outForDelivery: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={16}
      height={16}
      className="text-inherit"
      fill={'none'}
    >
      <circle cx="17" cy="18" r="2" stroke="currentColor" strokeWidth="2" />
      <circle cx="7" cy="18" r="2" stroke="currentColor" strokeWidth="2" />
      <path
        d="M5 17.9724C3.90328 17.9178 3.2191 17.7546 2.73223 17.2678C2.24536 16.7809 2.08222 16.0967 2.02755 15M9 18H15M19 17.9724C20.0967 17.9178 20.7809 17.7546 21.2678 17.2678C22 16.5355 22 15.357 22 13V11H17.3C16.5555 11 16.1832 11 15.882 10.9021C15.2731 10.7043 14.7957 10.2269 14.5979 9.61803C14.5 9.31677 14.5 8.94451 14.5 8.2C14.5 7.08323 14.5 6.52485 14.3532 6.07295C14.0564 5.15964 13.3404 4.44358 12.4271 4.14683C11.9752 4 11.4168 4 10.3 4H2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 8H8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 11H6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 6H16.3212C17.7766 6 18.5042 6 19.0964 6.35371C19.6886 6.70742 20.0336 7.34811 20.7236 8.6295L22 11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  cancelled: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={16}
      height={16}
      className="text-inherit"
      fill={'none'}
    >
      <path
        d="M14.9994 15L9 9M9.00064 15L15 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  ),
  delivered: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={16}
      height={16}
      className="text-inherit"
      fill={'none'}
    >
      <path
        d="M21 7V12M3 7C3 10.0645 3 16.7742 3 17.1613C3 18.5438 4.94564 19.3657 8.83693 21.0095C10.4002 21.6698 11.1818 22 12 22L12 11.3548"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 19C15 19 15.875 19 16.75 21C16.75 21 19.5294 16 22 15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.32592 9.69138L5.40472 8.27785C3.80157 7.5021 3 7.11423 3 6.5C3 5.88577 3.80157 5.4979 5.40472 4.72215L8.32592 3.30862C10.1288 2.43621 11.0303 2 12 2C12.9697 2 13.8712 2.4362 15.6741 3.30862L18.5953 4.72215C20.1984 5.4979 21 5.88577 21 6.5C21 7.11423 20.1984 7.5021 18.5953 8.27785L15.6741 9.69138C13.8712 10.5638 12.9697 11 12 11C11.0303 11 10.1288 10.5638 8.32592 9.69138Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 12L8 13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 4L7 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  returned: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={16}
      height={16}
      className="text-inherit"
      fill={'none'}
    >
      <path
        d="M15.5259 15.9772H18.7652C20.0444 15.9556 21.9986 16.6289 21.9986 19.0571C21.9986 21.5766 19.5871 21.999 18.7652 21.999C17.9433 21.999 10.1816 21.999 7.94429 21.999C5.4383 21.999 1.99999 21.4914 2 17.1681L2 8.00282H21.9986V12.5198M15.5259 15.9772C15.5313 15.7633 15.6223 15.5512 15.7991 15.3971L17.5009 13.9768M15.5259 15.9772C15.5202 16.2054 15.612 16.4357 15.8013 16.5996L17.5009 17.9832"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.00391 7.9912L2.92544 5.69028C3.67321 3.90211 4.04711 3.00803 4.80496 2.50463C5.56282 2.00122 6.53494 2.00122 8.47917 2.00122H15.4985C17.4427 2.00122 18.4148 2.00122 19.1727 2.50463C19.9306 3.00803 20.3044 3.90211 21.0522 5.69028L21.9981 7.99476"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M11.9629 8.00122V2.00122"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M9.96289 12.0012H13.9629"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  postponed: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={16}
      height={16}
      className="text-inherit"
      fill={'none'}
    >
      <path
        d="M16.5 2V5.5M7.5 2V5.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 12.5V11.5C21 7.72876 21 5.84315 19.8284 4.67157C18.6568 3.5 16.7712 3.5 13 3.5H11C7.22876 3.5 5.34315 3.5 4.17157 4.67157C3 5.84315 3 7.72876 3 11.5V13.5C3 17.2712 3 19.1569 4.17157 20.3284C5.34315 21.5 7.22876 21.5 11 21.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.5 9H20.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="17"
        cy="18"
        r="4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 19L17 18V16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  invalidAddress: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={16}
      height={16}
      className="text-inherit"
      fill={'none'}
    >
      <path
        d="M17.5 17.6461C16.2676 18.9628 14.8763 20.1884 13.6177 21.367C13.1841 21.773 12.6044 22 12.0011 22C11.3978 22 10.8182 21.773 10.3845 21.367C6.41302 17.626 1.09076 13.4469 3.68627 7.37966C4.02067 6.59797 4.46666 5.63512 5 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M7 3.48631C8.46914 2.53477 10.213 2 12.0011 2C15.5439 2 18.9126 4.09916 20.316 7.37966C21.6603 10.5221 20.8796 13.1643 19.2612 15.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M9 9C8.66525 9.53668 8.5 10.3209 8.5 11C8.5 12.933 10.067 14.5 12 14.5C12.6598 14.5 13.4732 14.3174 14 14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M11.5 7.53544C11.6633 7.51209 11.8302 7.5 12 7.5C13.933 7.5 15.5 9.067 15.5 11C15.5 11.1698 15.4879 11.3367 15.4646 11.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M2 2L22 22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  unreachable: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={16}
      height={16}
      className="text-inherit"
      fill={'none'}
    >
      <path
        d="M12 19H12.009"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 5H13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 2L22 22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.9954 18.9959C18.8156 20.9154 17.4284 22.0002 15.4954 22.0002H8.50391C6.57091 22.0002 5.00391 20.4332 5.00391 18.5002L5.10413 5.48584"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.15234 2.27035C7.56809 2.09621 8.02458 2 8.50354 2H15.495C17.428 2 18.995 3.567 18.995 5.5V15.0051"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};
