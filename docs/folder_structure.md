/smart
    /contracts
        /defi                 # Contratos relacionados a finanças descentralizadas
            /dex              # Contratos para funcionalidades da exchange descentralizada
                Token.sol
                MockERC20.sol
                Exchange.sol
                Factory.sol
                Swap.sol
            /staking          # Contratos para staking
                Staking.sol
            /lending          # Contratos para empréstimos
                Lending.sol
            /options          # Contratos para opções
                Options.sol
            /rewards          # Contratos para recompensas
                Reward.sol
            /stablecoin       # Contratos para stablecoin
                CentralizedStableCoin.sol
            /oracles          # Contratos para oráculos e mocks
                MockAggregator.sol
            /donations        # Contratos especificamente para gestão de doações
                DonationBase.sol       # Contrato base para lógicas de doação comuns
                DonationERC20.sol      # Contrato específico para doações com tokens ERC20
        /common               # Contratos comuns que são reutilizados
            Ownable.sol
            SafeMath.sol
        /interfaces          # Interfaces para interagir com tokens e outros contratos
            IERC20.sol
        /networkSpecific     # Contratos específicos para cada rede
            /ethereum
            /polygon
            /binanceSmartChain
        /utils               # Utilitários e bibliotecas comuns
            Errors.sol
    /scripts                # Scripts para deployment e outras automações
    /test                   # Testes para os contratos
    /deployments            # Histórico de deployments para diferentes redes
    hardhat.config.js       # Configuração do projeto Hardhat
