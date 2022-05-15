# Sizzler Network

[Sizzler Network](https://sizzler-network.vercel.app) enables the automation of recurring smart contracts tasks on Tezos by delegating them to bonded entities called 'Sizzlers'. It aims to function as a self-sustaining system through effective incentivisation and reward mechanics using its utility token called Sizzle.

## Motivation

- Complex smart contract systems often require actions to be taken automatically when the storage reaches a certain state. For instance, a smart contract system representing decentralised derivatives would ideally need automated margin calls and closing of positions. However, this cannot be implicitly done on-chain due to the way smart contracts work on Tezos.
- As a resolution, developers have to set up extensive dev-ops infrastructure to handle such tasks through external smart contract calls.
- Sizzler Network aims to solve this problem by providing a system to which dev-ops tasks can be off-loaded and left to be handled by entities called ‘Sizzlers’. These Sizzlers are rewarded and optionally incentivised through tips, using the network's utility token ‘Sizzle’ (SZL).
- Using Sizzler, developers could skip the tedious items that often lead to launch delays and tend to create a centralised point of failures, leading to untimely events and poor user experience if the infrastructure goes down.

To know more extensively about the system and its working, look into the elaborate [techinical paper](https://sizzler-network.vercel.app/technical_paper.pdf).

## Sample Task Contracts

A task involves the calling of a specific entrypoint in a specific contract. This entrypoint has to be written in a certain way for it to be approved by Sizzler Network. It must include a call to the `complete_task` entrypoint in the [TaskManager](https://github.com/AnshuJalan/sizzler-network/blob/master/contracts/task_manager.py) contract. This call can either be built into the core contracts of a platform, or a dedicated proxy contract can be set up (recommended). Examples for both methods are given below in [Smartpy](https://smartpy.io)

### In-build Call

```python
@sp.entry_point
def liquidate_position(self, position_id):
  sp.set_type(position_id, sp.TNat)

  # Logic to liquidate the associated position
  # ....

  # Required call to the TaskManager contract
  c = sp.contract(
    sp.TAddress,
    self.data.task_manager_address,
    "complete_task"
  ).open_some()
  sp.transfer(sp.sender, sp.tez(0), c)
```

### Proxied Call

```python
@sp.entry_point
def liquidate_position_proxy(self, position_id):
  sp.set_type(position_id, sp.TNat)

  # Call to core contract
  c_core = sp.contract(
    sp.TNat,
    self.data.core_address,
    "liquidate_position",
  ).open_some()
  sp.transfer(position_id, sp.tez(0), c)

  # Required call to the TaskManager contract
  c_task_manager = sp.contract(
    sp.TAddress,
    self.data.task_manager_address,
    "complete_task"
  ).open_some()
  sp.transfer(sp.sender, sp.tez(0), c_task_manager)
```

## Repo Structure

- `contracts`: Smart Contracts running Sizzler Network - all written in SmartPy.
- `dapp`: Front-end to interact with Sizzler Network.
- `deploy`: Helper scripts to deploy Sizzler Network contracts.
- `indexer`: Blockchain indexer for tasks and completion logs.

## Relevent Links

- Demo Video: https://youtu.be/POUpvT9ZVe8
- Website: https://sizzler-network.vercel.app

## Deployed Contracts

- **Sizzle Token -** [KT1E6Gg3tsWKaHgHTGGjjwWqqgoAJPkD6EHN](https://ithacanet.tzkt.io/KT1E6Gg3tsWKaHgHTGGjjwWqqgoAJPkD6EHN)
- **Dummy LP Token -** [KT1WpUCeyMJk1na7sPfDaiy8v6ZNh3TP5RWE](https://ithacanet.tzkt.io/KT1WpUCeyMJk1na7sPfDaiy8v6ZNh3TP5RWE)
- **Task Manager -** [KT1F8y2x8aBz3jmi3NbBsk7qibm3WQSYnVyZ](https://ithacanet.tzkt.io/KT1F8y2x8aBz3jmi3NbBsk7qibm3WQSYnVyZ)
- **Sizzler Manager -** [KT1PbPHZN59VGg1GCHGmPdfCXyWXSC7GohNu](https://ithacanet.tzkt.io/KT1PbPHZN59VGg1GCHGmPdfCXyWXSC7GohNu)
- **Minter -** [KT1AAnVMaY6mkbLHa6KDq2T38V8mLADwAxay](https://ithacanet.tzkt.io/KT1AAnVMaY6mkbLHa6KDq2T38V8mLADwAxay)
- **Governor -** [KT1JXTAZk3VCngXdneGjnKgiHyxEMmn9Zu2m](https://ithacanet.tzkt.io/KT1JXTAZk3VCngXdneGjnKgiHyxEMmn9Zu2m)

## Task Breakdowns

- [x] On-paper Designing
- [x] Smart Contracts
- [x] Unit Testing of Contracts
- [x] Deployment System
- [x] UI design
- [x] Front end components
- [x] Indexing system
- [x] Connection of front end with the contracts
- [x] Technical paper write-up
- [x] Walkthrough video
