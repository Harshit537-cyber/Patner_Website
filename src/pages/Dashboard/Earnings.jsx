import { Clock } from 'lucide-react';

const Earnings = () => {
  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <style>
        {`
          @keyframes earningsSpin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          @keyframes earningsPulse {
            0%, 100% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.08);
              opacity: 0.7;
            }
          }

          @keyframes earningsFloat {
            0%, 100% {
              transform: translateY(0);
              opacity: 0.4;
            }
            50% {
              transform: translateY(-10px);
              opacity: 1;
            }
          }

          @keyframes earningsFade {
            0%, 100% {
              opacity: 0.4;
            }
            50% {
              opacity: 1;
            }
          }

          .earnings-animation-ring {
            position: absolute;
            inset: 0;
            border-radius: 50%;
            border: 2px solid transparent;
            border-top-color: var(--color-primary);
            border-right-color: var(--color-primary);
            animation: earningsSpin 2s linear infinite;
          }

          .earnings-animation-icon {
            animation: earningsPulse 2s ease-in-out infinite;
          }

          .earnings-dot {
            position: absolute;
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: var(--color-primary);
            animation: earningsFloat 1.8s ease-in-out infinite;
          }

          .earnings-dot-one {
            top: 2px;
            left: 50%;
            animation-delay: 0s;
          }

          .earnings-dot-two {
            right: 2px;
            top: 50%;
            animation-delay: 0.4s;
          }

          .earnings-dot-three {
            bottom: 2px;
            left: 50%;
            animation-delay: 0.8s;
          }

          .earnings-dot-four {
            left: 2px;
            top: 50%;
            animation-delay: 1.2s;
          }

          .earnings-title {
            animation: earningsFade 2s ease-in-out infinite;
          }
        `}
      </style>

      <div
        className="page-card"
        style={{
          width: '100%',
          maxWidth: 520,
          padding: '55px 40px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: 100,
            height: 100,
            margin: '0 auto 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div className="earnings-animation-ring" />

          <div
            style={{
              width: 68,
              height: 68,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--color-primary-light)',
            }}
          >
            <Clock
              className="earnings-animation-icon"
              size={32}
            />
          </div>

          <span className="earnings-dot earnings-dot-one" />
          <span className="earnings-dot earnings-dot-two" />
          <span className="earnings-dot earnings-dot-three" />
          <span className="earnings-dot earnings-dot-four" />
        </div>

        <h2
          className="earnings-title"
          style={{
            margin: '0 0 12px',
            fontSize: '1.5rem',
            fontWeight: 700,
          }}
        >
          Earnings Under Process
        </h2>

        <p
          style={{
            margin: 0,
            color: 'var(--color-text-muted)',
            lineHeight: 1.7,
            fontSize: '0.95rem',
          }}
        >
          Your earnings section is currently under process.
          Please check back later for updated earnings and payout details.
        </p>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 6,
            marginTop: 24,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'var(--color-primary)',
              animation: 'earningsFade 1.2s infinite',
            }}
          />
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'var(--color-primary)',
              animation: 'earningsFade 1.2s infinite 0.2s',
            }}
          />
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'var(--color-primary)',
              animation: 'earningsFade 1.2s infinite 0.4s',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Earnings;