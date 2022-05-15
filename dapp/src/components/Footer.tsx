import SizzlerHat from "../assets/sizzler_hat.png";

const Footer = () => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-10 py-10 bg-secondary">
      {/* Header */}
      <div className="flex items-baseline gap-4">
        <img className="w-12" src={SizzlerHat} alt="hat" />
        <img src="/assets/brand_alt.png" alt="brand" className="w-28" />
      </div>
      <i className="hidden sm:block bi bi-dot text-xl text-white"></i>
      <div className="flex gap-4 text-3xl text-white">
        <a href="https://github.com/AnshuJalan/sizzler-network" target="_blank" rel="noreferrer">
          <i className="bi bi-github cursor-pointer"></i>
        </a>
        <a href="https://twitter.com/aj_jalan" target="_blank" rel="noreferrer">
          <i className="bi bi-twitter cursor-pointer"></i>
        </a>
        <a href="https://youtu.be/POUpvT9ZVe8" target="_blank" rel="noreferrer">
          <i className="bi bi-youtube cursor-pointer"></i>
        </a>
      </div>
    </div>
  );
};

export default Footer;
